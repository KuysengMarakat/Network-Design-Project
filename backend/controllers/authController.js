// ============================================================
//  KhmerCharm — Auth Controller
//  Handles register, login, and profile retrieval.
//
//  ⚠️ VULNERABLE DEMO areas are clearly marked below.
// ============================================================

const jwt    = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db     = require("../database/db");

// ─────────────────────────────────────────────
//  Helper — generate JWT
// ─────────────────────────────────────────────
function generateToken(user) {
  // ⚠️ VULNERABLE DEMO: weak secret + long expiry
  // FIX: Use strong 64-char random secret + short expiry (15m)
  //      with a separate refresh-token rotation strategy.
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "demo_secret_change_me",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

// ─────────────────────────────────────────────
//  POST /api/auth/register
// ─────────────────────────────────────────────
const register = (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    // Check duplicate email
    const existing = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email.toLowerCase().trim());

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // ─────────────────────────────────────────
    //  SECURE VERSION: hash password with bcrypt
    //  This is the correct approach.
    // ─────────────────────────────────────────
    const hashedPassword = bcrypt.hashSync(password, 12);

    const result = db
      .prepare(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
      )
      .run(
        name.trim(),
        email.toLowerCase().trim(),
        hashedPassword,   // ← bcrypt hash (secure)
        "customer"        // new registrations are always customers
      );

    const newUser = db
      .prepare("SELECT id, name, email, role, created_at FROM users WHERE id = ?")
      .get(result.lastInsertRowid);

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data: { user: newUser, token },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
//  POST /api/auth/login
// ─────────────────────────────────────────────
const login = (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email.toLowerCase().trim());

    if (!user) {
      // ⚠️ VULNERABLE DEMO: message reveals "email not found"
      // FIX: Always return the same generic message for both
      //      "wrong email" and "wrong password" to prevent
      //      user enumeration attacks.
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // ─────────────────────────────────────────
    //  DUAL PASSWORD CHECK (for demo flexibility)
    //
    //  The seed script stores PLAIN TEXT passwords for the
    //  admin/customer demo accounts so you can open the DB
    //  and see them directly — that's the vulnerability demo.
    //
    //  New accounts registered via /register use bcrypt hashes.
    //
    //  This login checks bcrypt first; if the stored value is
    //  NOT a bcrypt hash (doesn't start with $2), it falls back
    //  to plain-text comparison so demo accounts still work.
    //
    //  ⚠️ VULNERABLE DEMO: plain-text fallback
    //  FIX: Remove the plain-text fallback entirely and always
    //       use bcrypt.compare() for all accounts.
    // ─────────────────────────────────────────
    let passwordValid = false;

    if (user.password.startsWith("$2")) {
      // bcrypt hash — secure path
      passwordValid = bcrypt.compareSync(password, user.password);
    } else {
      // ⚠️ VULNERABLE DEMO: plain text comparison
      // This is intentionally insecure to show what NOT to do.
      // Do NOT use this in production.
      passwordValid = password === user.password;
    }

    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user);

    // Strip password before returning
    const { password: _pw, ...safeUser } = user;

    return res.json({
      success: true,
      message: "Login successful.",
      data: { user: safeUser, token },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
//  GET /api/auth/me
// ─────────────────────────────────────────────
const getMe = (req, res) => {
  // req.user is attached by protect middleware
  res.json({
    success: true,
    message: "Profile retrieved.",
    data: { user: req.user },
  });
};

module.exports = { register, login, getMe };
