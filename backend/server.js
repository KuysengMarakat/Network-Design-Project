// ============================================================
//  KhmerCharm Accessories — Backend API Server
//  Tech: Node.js + Express + SQLite (better-sqlite3)
//
//  ⚠️  EDUCATIONAL DEMO ONLY — localhost / private VM use.
//  Contains intentional vulnerabilities for cybersecurity demo.
//  See README.md for full attack & protect plan.
// ============================================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// Route imports
const authRoutes    = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes    = require("./routes/cartRoutes");
const orderRoutes   = require("./routes/orderRoutes");
const userRoutes    = require("./routes/userRoutes");
const adminRoutes   = require("./routes/adminRoutes");
const uploadRoutes  = require("./routes/uploadRoutes");

// Middleware imports
const errorHandler = require("./middleware/errorHandler");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ─────────────────────────────────────────────
//  CORS Configuration
//  Allows the React frontend(s) to communicate with this API.
//
//  FRONTEND_URL can hold ONE or MANY origins separated by commas:
//    FRONTEND_URL=http://localhost:5173,https://my-site.vercel.app
//  ───────────────────────────────────────────────────────────
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow non-browser tools (curl, Postman) which send no origin
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked: ${origin} is not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
// ⚠️ VULNERABLE DEMO: serving uploads/ directly with no auth check.
// FIX: Add authentication middleware or move files behind signed URLs.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─────────────────────────────────────────────
//  Request Logger (simple dev logging)
//  FIX (production): Use morgan + winston + centralized log server
//       to detect attack patterns (IDS/IPS).
// ─────────────────────────────────────────────
app.use((req, _res, next) => {
  const ts = new Date().toISOString();
  console.log(`[${ts}]  ${req.method}  ${req.originalUrl}`);
  next();
});

// ─────────────────────────────────────────────
//  API Routes
// ─────────────────────────────────────────────
app.use("/api/auth",     authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart",     cartRoutes);
app.use("/api/orders",   orderRoutes);
app.use("/api/users",    userRoutes);
app.use("/api/admin",    adminRoutes);
app.use("/api/upload",   uploadRoutes);

// ─────────────────────────────────────────────
//  Health Check
// ─────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "KhmerCharm API is running 🇰🇭",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler — must be before errorHandler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use(errorHandler);

// ─────────────────────────────────────────────
//  Start Server — wait for DB to init first
//  (sql.js loads its WASM asynchronously)
//
//  On hosting platforms with ephemeral disk (e.g. Render free tier),
//  the DB file disappears on every restart. We auto-seed if the
//  users table is empty so the demo is always populated.
// ─────────────────────────────────────────────
const db = require("./database/db");

async function autoSeedIfEmpty() {
  try {
    const row = db.prepare("SELECT COUNT(*) AS c FROM users").get();
    if (row && row.c === 0) {
      console.log("[DB] Empty database detected — running seed…");
      // Inline seed logic so we don't have to spawn a child process
      const bcrypt = require("bcryptjs");
      void bcrypt; // not used in plain-text demo seed
      db.exec(`DELETE FROM reviews; DELETE FROM order_items; DELETE FROM orders;
               DELETE FROM cart;    DELETE FROM products;    DELETE FROM users;
               DELETE FROM sqlite_sequence;`);

      db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)")
        .run("Admin KhmerCharm", "admin@khmercharm.com", "admin123", "admin");
      db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)")
        .run("Sophea Lim", "customer@khmercharm.com", "customer123", "customer");

      const seedProducts = [
        ["Golden Lotus Bracelet",  "Delicate 18k gold-plated lotus bracelet, inspired by Khmer sacred art.", "Bracelets",        12.00, 48000,  50,  "Popular", 5.0],
        ["Angkor Pearl Necklace",  "Freshwater pearl necklace with Angkor-motif gold pendant.",              "Necklaces",        18.50, 74000,  30,  "New",     5.0],
        ["Silk Charm Hair Clip",   "Hand-tied silk ribbon hair clip in traditional Khmer patterns.",         "Hair Accessories", 6.00,  24000,  80,  "Sale",    4.0],
        ["Handmade Woven Bag",     "Artisan-woven mini bag using traditional Cambodian palm leaf technique.","Bags",             34.00, 136000, 20,  "Popular", 5.0],
        ["Khmer Pattern Ring",     "Sterling silver ring engraved with traditional Khmer floral motif.",     "Rings",            8.50,  34000,  45,  "New",     4.0],
        ["Mini Lotus Phone Charm", "Tiny clay lotus flower phone charm, 100% handmade in Phnom Penh.",       "Phone Charms",     4.50,  18000,  100, "Sale",    5.0],
        ["Apsara Gold Earrings",   "Chandelier-style earrings inspired by Apsara dance headdress designs.",  "Earrings",         15.00, 60000,  35,  "Popular", 5.0],
        ["Clay Stone Keychain",    "Handmolded clay stone keychain with tiny Angkor Wat silhouette.",        "Keychains",        3.50,  14000,  120, "New",     4.0],
      ];
      const insertProduct = db.prepare(
        `INSERT INTO products (name, description, category, price_usd, price_khr, image_url, stock, tag, rating)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      );
      for (const p of seedProducts) {
        insertProduct.run(p[0], p[1], p[2], p[3], p[4], "/uploads/placeholder.png", p[5], p[6], p[7]);
      }
      console.log(`[DB] Seeded ${seedProducts.length} products and 2 users.`);
    }
  } catch (err) {
    console.warn("[DB] Auto-seed skipped:", err.message);
  }
}

db._init()
  .then(autoSeedIfEmpty)
  .then(() => {
    app.listen(PORT, () => {
      const url = `http://localhost:${PORT}`;
      console.log("╔══════════════════════════════════════════════╗");
      console.log("║   KhmerCharm Accessories — Backend API       ║");
      console.log(`║   Listening on port ${String(PORT).padEnd(25)}║`);
      console.log("╚══════════════════════════════════════════════╝");
      console.log(`   NODE_ENV       : ${process.env.NODE_ENV || "development"}`);
      console.log(`   DB PATH        : ${process.env.DATABASE_PATH || "./database/khmercharm.db"}`);
      console.log(`   ALLOWED ORIGINS: ${allowedOrigins.join(", ")}`);
      console.log(`   LOCAL URL      : ${url}`);
    });
  })
  .catch((err) => {
    console.error("[FATAL] Database failed to initialise:", err.message);
    process.exit(1);
  });

module.exports = app;
