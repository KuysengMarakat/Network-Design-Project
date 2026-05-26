// ============================================================
//  KhmerCharm — Product Controller
//
//  ⚠️ VULNERABLE DEMO routes clearly marked.
//  ✅ SECURE routes clearly marked.
// ============================================================

const db = require("../database/db");

// ─────────────────────────────────────────────
//  GET /api/products
//  Query params: category, search, tag, minPrice, maxPrice
// ─────────────────────────────────────────────
const getAllProducts = (req, res, next) => {
  try {
    const { category, search, tag, minPrice, maxPrice } = req.query;

    // Build parameterized query dynamically — this is the SECURE way
    let sql    = "SELECT * FROM products WHERE 1=1";
    const params = [];

    if (category) {
      sql += " AND category = ?";
      params.push(category);
    }
    if (tag) {
      sql += " AND tag = ?";
      params.push(tag);
    }
    if (search) {
      sql += " AND (name LIKE ? OR description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }
    if (minPrice) {
      sql += " AND price_usd >= ?";
      params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      sql += " AND price_usd <= ?";
      params.push(parseFloat(maxPrice));
    }

    sql += " ORDER BY created_at DESC";

    const products = db.prepare(sql).all(...params);

    return res.json({
      success: true,
      message: "Products retrieved.",
      data: { count: products.length, products },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
//  GET /api/products/:id
// ─────────────────────────────────────────────
const getProductById = (req, res, next) => {
  try {
    const product = db
      .prepare("SELECT * FROM products WHERE id = ?")
      .get(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    return res.json({ success: true, message: "Product retrieved.", data: { product } });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
//  POST /api/products  (admin only)
// ─────────────────────────────────────────────
const createProduct = (req, res, next) => {
  try {
    const { name, description, category, price_usd, price_khr,
            image_url, stock, tag, rating } = req.body;

    if (!name || !category || !price_usd || !price_khr) {
      return res.status(400).json({
        success: false,
        message: "name, category, price_usd, and price_khr are required.",
      });
    }

    const result = db.prepare(`
      INSERT INTO products (name, description, category, price_usd, price_khr, image_url, stock, tag, rating)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name, description || "", category,
      parseFloat(price_usd), parseInt(price_khr),
      image_url || "/uploads/placeholder.png",
      parseInt(stock) || 0,
      tag || null,
      parseFloat(rating) || 5.0
    );

    const newProduct = db
      .prepare("SELECT * FROM products WHERE id = ?")
      .get(result.lastInsertRowid);

    return res.status(201).json({
      success: true,
      message: "Product created.",
      data: { product: newProduct },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
//  PUT /api/products/:id  (admin only)
// ─────────────────────────────────────────────
const updateProduct = (req, res, next) => {
  try {
    const existing = db
      .prepare("SELECT * FROM products WHERE id = ?")
      .get(req.params.id);

    if (!existing) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    const { name, description, category, price_usd, price_khr,
            image_url, stock, tag, rating } = req.body;

    db.prepare(`
      UPDATE products SET
        name        = ?,
        description = ?,
        category    = ?,
        price_usd   = ?,
        price_khr   = ?,
        image_url   = ?,
        stock       = ?,
        tag         = ?,
        rating      = ?
      WHERE id = ?
    `).run(
      name        ?? existing.name,
      description ?? existing.description,
      category    ?? existing.category,
      price_usd   !== undefined ? parseFloat(price_usd)   : existing.price_usd,
      price_khr   !== undefined ? parseInt(price_khr)     : existing.price_khr,
      image_url   ?? existing.image_url,
      stock       !== undefined ? parseInt(stock)         : existing.stock,
      tag         !== undefined ? tag                     : existing.tag,
      rating      !== undefined ? parseFloat(rating)      : existing.rating,
      req.params.id
    );

    const updated = db
      .prepare("SELECT * FROM products WHERE id = ?")
      .get(req.params.id);

    return res.json({ success: true, message: "Product updated.", data: { product: updated } });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
//  DELETE /api/products/:id  (admin only)
// ─────────────────────────────────────────────
const deleteProduct = (req, res, next) => {
  try {
    const existing = db
      .prepare("SELECT id FROM products WHERE id = ?")
      .get(req.params.id);

    if (!existing) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);

    return res.json({ success: true, message: "Product deleted." });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
//  ⚠️ VULNERABLE DEMO — SQL Injection
//  GET /api/products/vulnerable-search?keyword=
//
//  This route builds the SQL query using STRING CONCATENATION,
//  allowing an attacker to inject arbitrary SQL commands.
//
//  DEMO ATTACK EXAMPLES (paste into ?keyword=):
//    Normal : ?keyword=bracelet
//    SQLi 1 : ?keyword=' OR '1'='1          → dumps ALL products
//    SQLi 2 : ?keyword=' OR '1'='1' --      → bypasses any WHERE clause
//    SQLi 3 : ?keyword=' UNION SELECT id,name,email,password,role,price_usd,price_khr,image_url,stock,tag,rating,created_at FROM users --
//             → extracts user table (passwords!) into product response
//
//  FIX: Use parameterized queries — see secureSearch below.
// ─────────────────────────────────────────────
const vulnerableSearch = (req, res, next) => {
  try {
    const keyword = req.query.keyword || "";

    // ⚠️ VULNERABLE DEMO:
    // This is intentionally weak for school demonstration.
    // Do NOT use string concatenation in real SQL queries.
    // An attacker can inject SQL here to read/modify/delete data.
    const sql = `SELECT * FROM products WHERE name LIKE '%${keyword}%' OR description LIKE '%${keyword}%'`;

    console.warn("[⚠️  VULNERABLE SEARCH] Raw SQL →", sql);

    const products = db.prepare(sql).all();

    return res.json({
      success: true,
      message: "⚠️ Vulnerable search results (SQL injection demo)",
      warning: "This endpoint uses string concatenation — vulnerable to SQL injection!",
      query_used: sql,
      data: { count: products.length, products },
    });
  } catch (err) {
    // Return the raw DB error in vulnerable mode so students see
    // the injection error message — useful for demo
    return res.status(500).json({
      success: false,
      message: "SQL Error (injection demo): " + err.message,
      sql_error: err.message,
    });
  }
};

// ─────────────────────────────────────────────
//  ✅ SECURE — Parameterized Query
//  GET /api/products/secure-search?keyword=
//
//  Uses prepared statement with ? placeholder.
//  The database driver treats keyword as DATA, not SQL code.
//  Injection attempts like ' OR '1'='1 are matched literally
//  as a text string — completely harmless.
// ─────────────────────────────────────────────
const secureSearch = (req, res, next) => {
  try {
    const keyword = req.query.keyword || "";

    // ✅ SECURE: parameterized query — keyword is bound as data
    const products = db
      .prepare(
        "SELECT * FROM products WHERE name LIKE ? OR description LIKE ?"
      )
      .all(`%${keyword}%`, `%${keyword}%`);

    return res.json({
      success: true,
      message: "✅ Secure search results (parameterized query)",
      data: { count: products.length, products },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
//  GET /api/products/:id/reviews
// ─────────────────────────────────────────────
const getProductReviews = (req, res, next) => {
  try {
    const reviews = db.prepare(`
      SELECT r.*, u.name AS reviewer_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
    `).all(req.params.id);

    return res.json({ success: true, message: "Reviews retrieved.", data: { reviews } });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
//  POST /api/products/:id/reviews  (customer)
// ─────────────────────────────────────────────
const addProductReview = (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    const product = db
      .prepare("SELECT id FROM products WHERE id = ?")
      .get(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    const result = db.prepare(`
      INSERT INTO reviews (product_id, user_id, rating, comment)
      VALUES (?, ?, ?, ?)
    `).run(req.params.id, req.user.id, parseInt(rating), comment || "");

    const review = db
      .prepare("SELECT * FROM reviews WHERE id = ?")
      .get(result.lastInsertRowid);

    return res.status(201).json({
      success: true,
      message: "Review added.",
      data: { review },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  vulnerableSearch,
  secureSearch,
  getProductReviews,
  addProductReview,
};
