// ============================================================
//  KhmerCharm — Order Routes
//  Base path: /api/orders
// ============================================================

const express = require("express");
const router  = express.Router();
const { protect }     = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const {
  createOrder,
  getMyOrders,
  getOrderById,
} = require("../controllers/orderController");

router.use(protect); // all order routes require login

// POST /api/orders         — create order from cart
router.post("/",      createOrder);

// GET  /api/orders         — my orders
router.get("/",       getMyOrders);

// GET  /api/orders/:id     — single order (owner or admin)
router.get("/:id",    getOrderById);

module.exports = router;
