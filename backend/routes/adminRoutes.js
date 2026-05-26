// ============================================================
//  KhmerCharm — Admin Routes
//  Base path: /api/admin
// ============================================================

const express = require("express");
const router  = express.Router();
const { protect }     = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const {
  getAllUsers,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
  // Demo vulnerability routes
  demoUsersVulnerable,  // ⚠️ no auth check
  secureUsers,          // ✅ proper auth + role check
} = require("../controllers/adminController");

// ─── ⚠️ VULNERABLE DEMO — No auth check ────────────────────
// GET /api/admin/demo-users
// Anyone can access this — demonstrates Broken Access Control.
// FIX: Add protect + requireRole('admin') middleware.
router.get("/demo-users", demoUsersVulnerable);

// ─── ✅ SECURE — Proper auth + role enforcement ───────────
// GET /api/admin/secure-users
router.get("/secure-users", protect, requireRole("admin"), secureUsers);

// ─── Protected admin routes ───────────────────────────────
// GET /api/admin/users
router.get("/users",   protect, requireRole("admin"), getAllUsers);

// GET /api/admin/orders
router.get("/orders",  protect, requireRole("admin"), getAllOrders);

// PUT /api/admin/orders/:id/status
router.put("/orders/:id/status", protect, requireRole("admin"), updateOrderStatus);

// GET /api/admin/dashboard
router.get("/dashboard", protect, requireRole("admin"), getDashboardStats);

module.exports = router;
