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
//  Allows the React frontend to communicate with this API.
//
//  ⚠️ VULNERABLE DEMO: credentials:true without strict origin
//     validation can be risky in production.
//  FIX: Lock down origin to specific trusted domains only.
// ─────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
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
// ─────────────────────────────────────────────
const db = require("./database/db");

db._init()
  .then(() => {
    app.listen(PORT, () => {
      console.log("╔══════════════════════════════════════════════╗");
      console.log("║   KhmerCharm Accessories — Backend API       ║");
      console.log(`║   Running on http://localhost:${PORT}           ║`);
      console.log("║   ⚠️  EDUCATIONAL DEMO — localhost only        ║");
      console.log("╚══════════════════════════════════════════════╝");
      console.log(`   NODE_ENV : ${process.env.NODE_ENV || "development"}`);
      console.log(`   DB PATH  : ${process.env.DATABASE_PATH || "./database/khmercharm.db"}`);
      console.log(`   FRONTEND : ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
    });
  })
  .catch((err) => {
    console.error("[FATAL] Database failed to initialise:", err.message);
    process.exit(1);
  });

module.exports = app;
