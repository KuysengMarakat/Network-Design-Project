// ============================================================
//  KhmerCharm — Role Middleware
//  Must be used AFTER protect middleware (requires req.user).
//
//  Usage:
//    router.get('/admin/users', protect, requireRole('admin'), handler)
//
//  ⚠️ VULNERABLE DEMO:
//    The /api/admin/demo-users route intentionally skips this
//    middleware to demonstrate Broken Access Control (BAC).
//  FIX: Always apply both protect + requireRole('admin') on
//       every admin endpoint.
// ============================================================

/**
 * requireRole(...roles) — only allow users whose role is in the list.
 * Example: requireRole('admin')
 *          requireRole('admin', 'moderator')
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      // Should not happen if protect ran first, but guard anyway
      return res.status(401).json({
        success: false,
        message: "Not authenticated.",
      });
    }

    if (!roles.includes(req.user.role)) {
      // ⚠️ Log the access attempt (useful for IDS/IPS demo)
      console.warn(
        `[ACCESS DENIED] User ${req.user.email} (role: ${req.user.role}) ` +
        `tried to access a route requiring role(s): ${roles.join(", ")}`
      );

      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(" or ")}.`,
      });
    }

    next();
  };
};

module.exports = { requireRole };
