// ============================================================
//  KhmerCharm — User Routes
//  Base path: /api/users
// ============================================================

const express = require("express");
const router  = express.Router();
const { protect }     = require("../middleware/authMiddleware");
const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/userController");

// GET  /api/users/profile
router.get("/profile",         protect, getProfile);

// PUT  /api/users/profile
router.put("/profile",         protect, updateProfile);

// PUT  /api/users/change-password
router.put("/change-password", protect, changePassword);

module.exports = router;
