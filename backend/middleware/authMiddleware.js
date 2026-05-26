// ============================================================
//  KhmerCharm — Auth Middleware
//  Verifies the JWT token sent in the Authorization header.
//
//  ⚠️ VULNERABLE DEMO notes:
//    - JWT_SECRET is weak ('demo_secret_change_me')
//    - No token expiry enforcement on the vulnerable routes
//    - Token passed in plain Authorization header (fine for demo,
//      but in production use HttpOnly cookies to prevent XSS theft)
//
//  FIX:
//    - Use a 64-char random secret: openssl rand -base64 64
//    - Set short expiry: expiresIn: '15m' + refresh token flow
//    - Use HttpOnly, Secure, SameSite=Strict cookies
// ============================================================

const jwt = require("jsonwebtoken");
const db  = require("../database/db");

// ─────────────────────────────────────────────
//  protect — requires a valid JWT
// ─────────────────────────────────────────────
const protect = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Expect: "Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // ⚠️ VULNERABLE DEMO: weak secret from .env
    // FIX: use strong secret + verify expiry strictly
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "demo_secret_change_me");

    // Fetch fresh user from DB (catches deleted/suspended accounts)
    const user = db
      .prepare("SELECT id, name, email, role FROM users WHERE id = ?")
      .get(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found." });
    }

    req.user = user; // attach user to request
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

// ─────────────────────────────────────────────
//  optionalAuth — attaches user if token present,
//  but does NOT block anonymous requests.
//  Useful for public product pages that show
//  "Add to wishlist" only when logged in.
// ─────────────────────────────────────────────
const optionalAuth = (req, _res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "demo_secret_change_me");
      const user = db
        .prepare("SELECT id, name, email, role FROM users WHERE id = ?")
        .get(decoded.id);
      if (user) req.user = user;
    } catch (_) {
      // Invalid token — just ignore, treat as anonymous
    }
  }
  next();
};

module.exports = { protect, optionalAuth };
