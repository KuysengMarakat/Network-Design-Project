// ============================================================
//  KhmerCharm — Product Routes
//  Base path: /api/products
// ============================================================

const express = require("express");
const router  = express.Router();
const { protect }           = require("../middleware/authMiddleware");
const { requireRole }       = require("../middleware/roleMiddleware");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  vulnerableSearch,   // ⚠️ DEMO: SQL injection vulnerable
  secureSearch,       // ✅ DEMO: parameterized query
  getProductReviews,
  addProductReview,
} = require("../controllers/productController");

// ─── Public routes ───────────────────────────────────────────
// GET /api/products?category=&search=&tag=&minPrice=&maxPrice=
router.get("/", getAllProducts);

// ⚠️ VULNERABLE: must be declared BEFORE /:id or it gets swallowed
// GET /api/products/vulnerable-search?keyword=
router.get("/vulnerable-search", vulnerableSearch);

// ✅ SECURE search
// GET /api/products/secure-search?keyword=
router.get("/secure-search", secureSearch);

// GET /api/products/:id
router.get("/:id", getProductById);

// GET /api/products/:id/reviews
router.get("/:id/reviews", getProductReviews);

// ─── Protected: customer ─────────────────────────────────────
// POST /api/products/:id/reviews
router.post("/:id/reviews", protect, addProductReview);

// ─── Protected: admin only ───────────────────────────────────
// POST /api/products
router.post("/", protect, requireRole("admin"), createProduct);

// PUT /api/products/:id
router.put("/:id", protect, requireRole("admin"), updateProduct);

// DELETE /api/products/:id
router.delete("/:id", protect, requireRole("admin"), deleteProduct);

module.exports = router;
