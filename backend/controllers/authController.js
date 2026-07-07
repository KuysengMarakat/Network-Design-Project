// ============================================================
//  KhmerCharm — Auth Controller
//  Handles register, login, and profile retrieval.
// ============================================================

const jwt    = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db     = require("../database/db");
const { logEvent } = require("../middleware/logger");  // 👈 ADD THIS LINE (line 8)

// ─────────────────────────────────────────────
//  Helper — generate JWT
// ─────────────────────────────────────────────
function generateToken(user) {
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

    const existing = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email.toLowerCase().trim());

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 12);

    const result = db
      .prepare(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
      )
      .run(
        name.trim(),
        email.toLowerCase().trim(),
        hashedPassword,
        "customer"
      );

    const newUser = db
      .prepare("SELECT id, name, email, role, created_at FROM users WHERE id = ?")
      .get(result.lastInsertRowid);

    const token = generateToken(newUser);

    logEvent(req, 'user_register', email);  // 👈 ADD THIS LINE

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
      logEvent(req, 'login_failed', email);  // 👈 ADD THIS LINE
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    let passwordValid = false;

    if (user.password.startsWith("$2")) {
      passwordValid = bcrypt.compareSync(password, user.password);
    } else {
      passwordValid = password === user.password;
    }

    if (!passwordValid) {
      logEvent(req, 'login_failed', email);  // 👈 ADD THIS LINE
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user);

    const { password: _pw, ...safeUser } = user;

    logEvent(req, 'login_success', email);  // 👈 ADD THIS LINE

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
  res.json({
    success: true,
    message: "Profile retrieved.",
    data: { user: req.user },
  });
};

module.exports = { register, login, getMe };
