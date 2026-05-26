// ============================================================
//  KhmerCharm — Cart Routes
//  Base path: /api/cart
//  All routes require authentication.
// ============================================================

const express = require("express");
const router  = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");

router.use(protect); // all cart routes require login

// GET    /api/cart
router.get("/",      getCart);

// POST   /api/cart
router.post("/",     addToCart);

// PUT    /api/cart/:id
router.put("/:id",   updateCartItem);

// DELETE /api/cart/:id
router.delete("/:id", removeCartItem);

// DELETE /api/cart   (clear entire cart)
router.delete("/",   clearCart);

module.exports = router;
