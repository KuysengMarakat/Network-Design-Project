// ============================================================
//  KhmerCharm — Database Seeder
//  Run: node database/seed.js
//
//  ⚠️ VULNERABLE DEMO: Passwords stored as PLAIN TEXT so the
//     "weak password storage" vulnerability is obvious in the DB.
//  FIX: Replace with bcrypt.hashSync(password, 12) before
//       any real deployment.
// ============================================================

require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const db = require("./db");

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────
function wipe() {
  // Clear in reverse FK order
  db.exec(`
    DELETE FROM reviews;
    DELETE FROM order_items;
    DELETE FROM orders;
    DELETE FROM cart;
    DELETE FROM products;
    DELETE FROM users;
    -- reset autoincrement counters
    DELETE FROM sqlite_sequence WHERE name IN
      ('reviews','order_items','orders','cart','products','users');
  `);
  console.log("[SEED] Tables cleared.");
}

// ─────────────────────────────────────────────
//  Users
// ─────────────────────────────────────────────
const USERS = [
  {
    name: "Admin KhmerCharm",
    email: "admin@khmercharm.com",
    // ⚠️ VULNERABLE DEMO: plain text password — do NOT do this in production.
    // FIX: const bcrypt = require('bcryptjs'); bcrypt.hashSync('admin123', 12)
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

// ─────────────────────────────────────────────
//  Products — matches KhmerCharm frontend data
// ─────────────────────────────────────────────
const PRODUCTS = [
  {
    name: "Golden Lotus Bracelet",
    description: "Delicate 18k gold-plated lotus bracelet, inspired by Khmer sacred art. Adjustable size, suitable for all wrists.",
    category: "Bracelets",
    price_usd: 12.00,
    price_khr: 48000,
    image_url: "/uploads/placeholder.png",
    stock: 50,
    tag: "Popular",
    rating: 5.0,
  },
  {
    name: "Angkor Pearl Necklace",
    description: "Freshwater pearl necklace with Angkor-motif gold pendant. Handcrafted by local artisans in Phnom Penh.",
    category: "Necklaces",
    price_usd: 18.50,
    price_khr: 74000,
    image_url: "/uploads/placeholder.png",
    stock: 30,
    tag: "New",
    rating: 5.0,
  },
  {
    name: "Silk Charm Hair Clip",
    description: "Hand-tied silk ribbon hair clip in traditional Khmer patterns. Available in multiple colors.",
    category: "Hair Accessories",
    price_usd: 6.00,
    price_khr: 24000,
    image_url: "/uploads/placeholder.png",
    stock: 80,
    tag: "Sale",
    rating: 4.0,
  },
  {
    name: "Handmade Woven Bag",
    description: "Artisan-woven mini bag using traditional Cambodian palm leaf technique. Unique, eco-friendly, and stylish.",
    category: "Bags",
    price_usd: 34.00,
    price_khr: 136000,
    image_url: "/uploads/placeholder.png",
    stock: 20,
    tag: "Popular",
    rating: 5.0,
  },
  {
    name: "Khmer Pattern Ring",
    description: "Sterling silver ring engraved with traditional Khmer floral motif. Sizes 5-10 available.",
    category: "Rings",
    price_usd: 8.50,
    price_khr: 34000,
    image_url: "/uploads/placeholder.png",
    stock: 45,
    tag: "New",
    rating: 4.0,
  },
  {
    name: "Mini Lotus Phone Charm",
    description: "Tiny clay lotus flower phone charm, 100% handmade in Phnom Penh. Attaches to any phone case.",
    category: "Phone Charms",
    price_usd: 4.50,
    price_khr: 18000,
    image_url: "/uploads/placeholder.png",
    stock: 100,
    tag: "Sale",
    rating: 5.0,
  },
  {
    name: "Royal Gold Earrings",
    description: "Chandelier-style earrings inspired by Apsara dance headdress designs. Gold-plated brass, nickel-free.",
    category: "Necklaces",
    price_usd: 15.00,
    price_khr: 60000,
    image_url: "/uploads/placeholder.png",
    stock: 35,
    tag: "Popular",
    rating: 5.0,
  },
  {
    name: "Clay Stone Keychain",
    description: "Handmolded clay stone keychain with tiny Angkor Wat silhouette. A perfect gift and travel souvenir.",
    category: "Phone Charms",
    price_usd: 3.50,
    price_khr: 14000,
    image_url: "/uploads/placeholder.png",
    stock: 120,
    tag: "New",
    rating: 4.0,
  },
];

// ─────────────────────────────────────────────
//  Reviews
// ─────────────────────────────────────────────
// product_id and user_id will be resolved after insertion
const REVIEWS_TEMPLATE = [
  {
    productName: "Golden Lotus Bracelet",
    userEmail: "customer@khmercharm.com",
    rating: 5,
    comment: "I ordered this as a gift for my sister and she absolutely loved it! The quality is amazing and it arrived beautifully packaged. Will definitely order again 💛",
  },
  {
    productName: "Khmer Pattern Ring",
    userEmail: "customer@khmercharm.com",
    rating: 5,
    comment: "The ring is so unique and beautifully crafted. You can tell it was made with real care. I get compliments every time I wear it!",
  },
  {
    productName: "Mini Lotus Phone Charm",
    userEmail: "customer@khmercharm.com",
    rating: 5,
    comment: "Fast delivery, great packaging, and the charm is even cuter in person! KhmerCharm is my new favourite shop 🌸",
  },
];

// ─────────────────────────────────────────────
//  Run seed
// ─────────────────────────────────────────────
function seed() {
  console.log("\n[SEED] Starting KhmerCharm database seed...\n");

  wipe();

  // Insert users
  const insertUser = db.prepare(
    `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`
  );
  for (const u of USERS) {
    insertUser.run(u.name, u.email, u.password, u.role);
    console.log(`[SEED] User   → ${u.email}  (${u.role})  password: ${u.password}`);
  }

  // Insert products
  const insertProduct = db.prepare(`
    INSERT INTO products (name, description, category, price_usd, price_khr, image_url, stock, tag, rating)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const p of PRODUCTS) {
    insertProduct.run(
      p.name, p.description, p.category,
      p.price_usd, p.price_khr, p.image_url,
      p.stock, p.tag, p.rating
    );
    console.log(`[SEED] Product → ${p.name}  $${p.price_usd}`);
  }

  // Insert reviews (resolve IDs)
  const insertReview = db.prepare(`
    INSERT INTO reviews (product_id, user_id, rating, comment)
    VALUES (?, ?, ?, ?)
  `);
  for (const r of REVIEWS_TEMPLATE) {
    const product = db.prepare("SELECT id FROM products WHERE name = ?").get(r.productName);
    const user    = db.prepare("SELECT id FROM users   WHERE email = ?").get(r.userEmail);
    if (product && user) {
      insertReview.run(product.id, user.id, r.rating, r.comment);
      console.log(`[SEED] Review  → "${r.productName}" by ${r.userEmail}`);
    }
  }

  console.log("\n[SEED] ✅ Database seeded successfully!\n");
  console.log("  ┌──────────────────────────────────────────────────────┐");
  console.log("  │  Sample Credentials (DEMO ONLY — localhost)           │");
  console.log("  │  Admin    : admin@khmercharm.com    / admin123        │");
  console.log("  │  Customer : customer@khmercharm.com / customer123     │");
  console.log("  └──────────────────────────────────────────────────────┘\n");
}

seed();
process.exit(0);
