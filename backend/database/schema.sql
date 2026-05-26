-- ============================================================
--  KhmerCharm Accessories — SQLite Schema
--  Run automatically by db.js on every server start.
-- ============================================================

-- ─────────────────────────────────────
--  1. USERS
-- ─────────────────────────────────────
-- ⚠️ VULNERABLE DEMO: password column stores PLAIN TEXT in the
--    seed data for easy demo.  
-- FIX: Always store bcrypt hashes. Never store plaintext passwords.
CREATE TABLE IF NOT EXISTS users (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL,
  email      TEXT    NOT NULL UNIQUE,
  password   TEXT    NOT NULL,         -- ⚠️ plain text in demo seed
  role       TEXT    NOT NULL DEFAULT 'customer' CHECK(role IN ('customer','admin')),
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────────────────────────
--  2. PRODUCTS
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  description TEXT,
  category    TEXT    NOT NULL,
  price_usd   REAL    NOT NULL,
  price_khr   INTEGER NOT NULL,
  image_url   TEXT    DEFAULT '/uploads/placeholder.png',
  stock       INTEGER NOT NULL DEFAULT 0,
  tag         TEXT    DEFAULT NULL,    -- 'New' | 'Popular' | 'Sale' | NULL
  rating      REAL    NOT NULL DEFAULT 5.0,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────────────────────────
--  3. CART
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity   INTEGER NOT NULL DEFAULT 1,
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, product_id)           -- one row per product per user
);

-- ─────────────────────────────────────
--  4. ORDERS
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id          INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  total_usd        REAL    NOT NULL,
  total_khr        INTEGER NOT NULL,
  status           TEXT    NOT NULL DEFAULT 'pending'
                           CHECK(status IN ('pending','processing','shipped','delivered','cancelled')),
  shipping_address TEXT,
  phone            TEXT,
  created_at       TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────────────────────────
--  5. ORDER ITEMS
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id   INTEGER NOT NULL REFERENCES orders(id)   ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE SET NULL,
  quantity   INTEGER NOT NULL,
  price_usd  REAL    NOT NULL,
  price_khr  INTEGER NOT NULL
);

-- ─────────────────────────────────────
--  6. REVIEWS
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id    INTEGER NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  rating     INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  comment    TEXT,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────────────────────────
--  Indexes for common lookups
-- ─────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_tag      ON products(tag);
CREATE INDEX IF NOT EXISTS idx_cart_user         ON cart(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user       ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product   ON reviews(product_id);
