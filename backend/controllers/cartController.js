// ============================================================
//  KhmerCharm — Cart Controller
// ============================================================

const db = require("../database/db");

// Helper — fetch full cart rows with product details for a user
function fetchCart(userId) {
  return db.prepare(`
    SELECT
      c.id          AS cart_id,
      c.quantity,
      c.created_at,
      p.id          AS product_id,
      p.name,
      p.price_usd,
      p.price_khr,
      p.image_url,
      p.stock,
      p.category,
      p.tag
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
    ORDER BY c.created_at DESC
  `).all(userId);
}

// Helper — compute totals
function computeTotals(items) {
  const total_usd = items.reduce((s, i) => s + i.price_usd * i.quantity, 0);
  const total_khr = items.reduce((s, i) => s + i.price_khr * i.quantity, 0);
  return {
    total_usd: Math.round(total_usd * 100) / 100,
    total_khr,
    item_count: items.reduce((s, i) => s + i.quantity, 0),
  };
}

// ─────────────────────────────────────────────
//  GET /api/cart
// ─────────────────────────────────────────────
const getCart = (req, res, next) => {
  try {
    const items = fetchCart(req.user.id);
    const totals = computeTotals(items);

    return res.json({
      success: true,
      message: "Cart retrieved.",
      data: { items, ...totals },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
//  POST /api/cart
//  Body: { product_id, quantity }
// ─────────────────────────────────────────────
const addToCart = (req, res, next) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({ success: false, message: "product_id is required." });
    }

    const product = db
      .prepare("SELECT * FROM products WHERE id = ?")
      .get(product_id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    const qty = Math.max(1, parseInt(quantity));

    if (qty > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items in stock.`,
      });
    }

    // Upsert — if row exists, increment quantity
    const existing = db
      .prepare("SELECT * FROM cart WHERE user_id = ? AND product_id = ?")
      .get(req.user.id, product_id);

    if (existing) {
      const newQty = Math.min(existing.quantity + qty, product.stock);
      db.prepare("UPDATE cart SET quantity = ? WHERE id = ?")
        .run(newQty, existing.id);
    } else {
      db.prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)")
        .run(req.user.id, product_id, qty);
    }

    const items  = fetchCart(req.user.id);
    const totals = computeTotals(items);

    return res.status(201).json({
      success: true,
      message: `"${product.name}" added to cart.`,
      data: { items, ...totals },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
//  PUT /api/cart/:id
//  Body: { quantity }
//  :id is the cart row id
// ─────────────────────────────────────────────
const updateCartItem = (req, res, next) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "quantity must be >= 1. Use DELETE to remove.",
      });
    }

    const cartItem = db
      .prepare("SELECT * FROM cart WHERE id = ? AND user_id = ?")
      .get(req.params.id, req.user.id);

    if (!cartItem) {
      return res.status(404).json({ success: false, message: "Cart item not found." });
    }

    const product = db
      .prepare("SELECT stock FROM products WHERE id = ?")
      .get(cartItem.product_id);

    const newQty = Math.min(parseInt(quantity), product.stock);
    db.prepare("UPDATE cart SET quantity = ? WHERE id = ?")
      .run(newQty, cartItem.id);

    const items  = fetchCart(req.user.id);
    const totals = computeTotals(items);

    return res.json({
      success: true,
      message: "Cart item updated.",
      data: { items, ...totals },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
//  DELETE /api/cart/:id
// ─────────────────────────────────────────────
const removeCartItem = (req, res, next) => {
  try {
    const cartItem = db
      .prepare("SELECT id FROM cart WHERE id = ? AND user_id = ?")
      .get(req.params.id, req.user.id);

    if (!cartItem) {
      return res.status(404).json({ success: false, message: "Cart item not found." });
    }

    db.prepare("DELETE FROM cart WHERE id = ?").run(cartItem.id);

    const items  = fetchCart(req.user.id);
    const totals = computeTotals(items);

    return res.json({
      success: true,
      message: "Item removed from cart.",
      data: { items, ...totals },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
//  DELETE /api/cart  (clear all)
// ─────────────────────────────────────────────
const clearCart = (req, res, next) => {
  try {
    db.prepare("DELETE FROM cart WHERE user_id = ?").run(req.user.id);

    return res.json({
      success: true,
      message: "Cart cleared.",
      data: { items: [], total_usd: 0, total_khr: 0, item_count: 0 },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
