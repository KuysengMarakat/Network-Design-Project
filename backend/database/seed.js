// ============================================================
//  KhmerCharm — Database Seeder  (sql.js version)
//  Run: node database/seed.js
//
//  ⚠️ VULNERABLE DEMO: Passwords stored as PLAIN TEXT so the
//     "weak password storage" vulnerability is obvious in DB.
//  FIX: Replace with bcrypt.hashSync(password, 12).
// ============================================================

require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const db = require("./db");

async function seed() {
  // Wait for sql.js WASM to load and DB file to be ready
  await db._init();

  console.log("\n[SEED] Starting KhmerCharm database seed...\n");

  // ── Wipe existing data ──────────────────────────────────
  db.exec(`
    DELETE FROM reviews;
    DELETE FROM order_items;
    DELETE FROM orders;
    DELETE FROM cart;
    DELETE FROM products;
    DELETE FROM users;
    DELETE FROM sqlite_sequence;
  `);
  console.log("[SEED] Tables cleared.");

  // ── Users ───────────────────────────────────────────────
  const USERS = [
    {
      name: "Admin KhmerCharm",
      email: "admin@khmercharm.com",
      // ⚠️ VULNERABLE DEMO: plain text — do NOT do this in production.
      // FIX: bcrypt.hashSync('admin123', 12)
      password: "admin123",
      role: "admin",
    },
    {
      name: "Sophea Lim",
      email: "customer@khmercharm.com",
      // ⚠️ VULNERABLE DEMO: plain text password
      password: "customer123",
      role: "customer",
    },
  ];

  for (const u of USERS) {
    db.prepare(
      `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`
    ).run(u.name, u.email, u.password, u.role);
    console.log(`[SEED] User    → ${u.email}  (${u.role})  password: ${u.password}`);
  }

  // ── Products ─────────────────────────────────────────────
  const PRODUCTS = [
    {
      name: "Golden Lotus Bracelet",
      description: "Delicate 18k gold-plated lotus bracelet, inspired by Khmer sacred art.",
      category: "Bracelets",    price_usd: 12.00,  price_khr: 48000,  stock: 50,  tag: "Popular", rating: 5.0,
    },
    {
      name: "Angkor Pearl Necklace",
      description: "Freshwater pearl necklace with Angkor-motif gold pendant.",
      category: "Necklaces",    price_usd: 18.50,  price_khr: 74000,  stock: 30,  tag: "New",     rating: 5.0,
    },
    {
      name: "Silk Charm Hair Clip",
      description: "Hand-tied silk ribbon hair clip in traditional Khmer patterns.",
      category: "Hair Accessories", price_usd: 6.00, price_khr: 24000, stock: 80, tag: "Sale",    rating: 4.0,
    },
    {
      name: "Handmade Woven Bag",
      description: "Artisan-woven mini bag using traditional Cambodian palm leaf technique.",
      category: "Bags",         price_usd: 34.00,  price_khr: 136000, stock: 20,  tag: "Popular", rating: 5.0,
    },
    {
      name: "Khmer Pattern Ring",
      description: "Sterling silver ring engraved with traditional Khmer floral motif.",
      category: "Rings",        price_usd: 8.50,   price_khr: 34000,  stock: 45,  tag: "New",     rating: 4.0,
    },
    {
      name: "Mini Lotus Phone Charm",
      description: "Tiny clay lotus flower phone charm, 100% handmade in Phnom Penh.",
      category: "Phone Charms", price_usd: 4.50,   price_khr: 18000,  stock: 100, tag: "Sale",    rating: 5.0,
    },
    {
      name: "Royal Gold Earrings",
      description: "Chandelier-style earrings inspired by Apsara dance headdress designs.",
      category: "Necklaces",    price_usd: 15.00,  price_khr: 60000,  stock: 35,  tag: "Popular", rating: 5.0,
    },
    {
      name: "Clay Stone Keychain",
      description: "Handmolded clay stone keychain with tiny Angkor Wat silhouette.",
      category: "Phone Charms", price_usd: 3.50,   price_khr: 14000,  stock: 120, tag: "New",     rating: 4.0,
    },
  ];

  for (const p of PRODUCTS) {
    db.prepare(`
      INSERT INTO products
        (name, description, category, price_usd, price_khr, image_url, stock, tag, rating)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      p.name, p.description, p.category,
      p.price_usd, p.price_khr,
      "/uploads/placeholder.png",
      p.stock, p.tag, p.rating
    );
    console.log(`[SEED] Product → ${p.name}  $${p.price_usd}`);
  }

  // ── Reviews ──────────────────────────────────────────────
  const REVIEWS = [
    {
      productName: "Golden Lotus Bracelet",
      userEmail:   "customer@khmercharm.com",
      rating: 5,
      comment: "I ordered this as a gift for my sister and she absolutely loved it! Amazing quality 💛",
    },
    {
      productName: "Khmer Pattern Ring",
      userEmail:   "customer@khmercharm.com",
      rating: 5,
      comment: "So unique and beautifully crafted. I get compliments every time I wear it!",
    },
    {
      productName: "Mini Lotus Phone Charm",
      userEmail:   "customer@khmercharm.com",
      rating: 5,
      comment: "Fast delivery, great packaging, even cuter in person! KhmerCharm is my favourite shop 🌸",
    },
  ];

  for (const r of REVIEWS) {
    const product = db.prepare("SELECT id FROM products WHERE name = ?").get(r.productName);
    const user    = db.prepare("SELECT id FROM users   WHERE email = ?").get(r.userEmail);
    if (product && user) {
      db.prepare(
        `INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)`
      ).run(product.id, user.id, r.rating, r.comment);
      console.log(`[SEED] Review  → "${r.productName}" by ${r.userEmail}`);
    }
  }

  console.log("\n[SEED] ✅ Database seeded successfully!\n");
  console.log("  ┌─────────────────────────────────────────────────────┐");
  console.log("  │  Sample Credentials (DEMO ONLY — localhost)          │");
  console.log("  │  Admin    : admin@khmercharm.com    / admin123       │");
  console.log("  │  Customer : customer@khmercharm.com / customer123    │");
  console.log("  └─────────────────────────────────────────────────────┘\n");

  process.exit(0);
}

seed().catch((err) => {
  console.error("[SEED ERROR]", err.message);
  process.exit(1);
});
