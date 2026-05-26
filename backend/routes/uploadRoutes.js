// ============================================================
//  KhmerCharm — Upload Routes
//  Base path: /api/upload
// ============================================================

const express = require("express");
const router  = express.Router();
const { protect }     = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const {
  demoUploadVulnerable,   // ⚠️ accepts all file types
  secureUpload,           // ✅ restricted file type + size
  multerDemo,
  multerSecure,
} = require("../controllers/uploadController");

// ⚠️ VULNERABLE DEMO — no auth, no file type restriction
// POST /api/upload/demo
router.post("/demo", multerDemo.single("file"), demoUploadVulnerable);

// ✅ SECURE — auth required, images only, size-limited
// POST /api/upload/secure
router.post(
  "/secure",
  protect,
  requireRole("admin"),
  multerSecure.single("file"),
  secureUpload
);

module.exports = router;
