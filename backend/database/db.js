// ============================================================
//  KhmerCharm — SQLite Database Connection (better-sqlite3)
//  Synchronous API — no callbacks, no promise chains needed.
// ============================================================

const Database = require("better-sqlite3");
const path     = require("path");
const fs       = require("fs");

// Resolve DB file path from .env or default
const DB_PATH = path.resolve(
  process.env.DATABASE_PATH || "./database/khmercharm.db"
);

// Ensure the directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Open (or create) the database file
const db = new Database(DB_PATH, {
  // verbose: console.log   // ← uncomment to log every SQL statement
});

// Enable WAL mode for better concurrent read performance
db.pragma("journal_mode = WAL");

// Enforce foreign key constraints
db.pragma("foreign_keys = ON");

// ─────────────────────────────────────────────
//  Schema bootstrap — run on every startup.
//  Uses CREATE TABLE IF NOT EXISTS so it's safe
//  to call repeatedly without wiping data.
// ─────────────────────────────────────────────
const schemaSQL = fs.readFileSync(
  path.join(__dirname, "schema.sql"),
  "utf8"
);
db.exec(schemaSQL);

console.log(`[DB] Connected → ${DB_PATH}`);

module.exports = db;
