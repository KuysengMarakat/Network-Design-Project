// ============================================================
//  KhmerCharm — User Controller
//  Profile management for logged-in customers.
// ============================================================

const bcrypt = require("bcryptjs");
const db     = require("../database/db");

// ─────────────────────────────────────────────
//  GET /api/users/profile
// ─────────────────────────────────────────────
const getProfile = (req, res) => {
  const user = db
    .prepare("SELECT id, name, email, role, created_at FROM users WHERE id = ?")
    .get(req.user.id);

  return res.json({ success: true, message: "Profile retrieved.", data: { user } });
};

// ─────────────────────────────────────────────
//  PUT /api/users/profile
//  Body: { name, email }
// ─────────────────────────────────────────────
const updateProfile = (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({
        success: false,
        message: "Provide at least name or email to update.",
      });
    }

    const current = db
      .prepare("SELECT * FROM users WHERE id = ?")
      .get(req.user.id);

    // Check email uniqueness if changing email
    if (email && email !== current.email) {
      const taken = db
        .prepare("SELECT id FROM users WHERE email = ? AND id != ?")
        .get(email.toLowerCase().trim(), req.user.id);
      if (taken) {
        return res.status(409).json({
          success: false,
          message: "Email already in use by another account.",
        });
      }
    }

    db.prepare(
      "UPDATE users SET name = ?, email = ? WHERE id = ?"
    ).run(
      name  || current.name,
      email ? email.toLowerCase().trim() : current.email,
      req.user.id
    );

    const updated = db
      .prepare("SELECT id, name, email, role, created_at FROM users WHERE id = ?")
      .get(req.user.id);

    return res.json({ success: true, message: "Profile updated.", data: { user: updated } });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
//  PUT /api/users/change-password
//  Body: { currentPassword, newPassword }
// ─────────────────────────────────────────────
const changePassword = (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "currentPassword and newPassword are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters.",
      });
    }

    const user = db
      .prepare("SELECT * FROM users WHERE id = ?")
      .get(req.user.id);

    // Verify current password (handle both bcrypt and plain-text demo accounts)
    let valid = false;
    if (user.password.startsWith("$2")) {
      valid = bcrypt.compareSync(currentPassword, user.password);
    } else {
      valid = currentPassword === user.password;
    }

    if (!valid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    // Hash new password — always bcrypt for new passwords
    const hashed = bcrypt.hashSync(newPassword, 12);
    db.prepare("UPDATE users SET password = ? WHERE id = ?")
      .run(hashed, req.user.id);

    return res.json({ success: true, message: "Password changed successfully." });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, changePassword };
