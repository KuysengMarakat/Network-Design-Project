// ============================================================
//  KhmerCharm — SQLite Database (sql.js)
//
//  sql.js is pure JavaScript (WebAssembly) — NO C++ build
//  tools needed on Windows. Works on all platforms.
//
//  How it works differently from better-sqlite3:
//    - The DB lives in memory while the server runs.
//    - We load from the .db file on startup.
//    - We save back to the .db file after every write.
//    - API is almost identical: db.prepare(sql).run() / .get() / .all()
// ============================================================

const initSqlJs = require("sql.js");
const path      = require("path");
const fs        = require("fs");

const DB_PATH = path.resolve(
  process.env.DATABASE_PATH || "./database/khmercharm.db"
);

// Ensure the directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// ─────────────────────────────────────────────
//  We export a PROMISE that resolves to the db
//  wrapper object.  All modules that need the db
//  do:  const db = require('./db');  then use it
//  after the server is ready.
//
//  To keep every controller synchronous (same as
//  before), we expose a thin wrapper that matches
//  the better-sqlite3 API exactly.
// ─────────────────────────────────────────────

let _db     = null;   // sql.js Database instance
let _dirty  = false;  // true when there are unsaved writes

// Save DB file to disk
function persist() {
  if (!_db) return;
  const data = _db.export();          // Uint8Array
  fs.writeFileSync(DB_PATH, Buffer.from(data));
  _dirty = false;
}

// Auto-save every 500ms if dirty (batches writes efficiently)
setInterval(() => { if (_dirty) persist(); }, 500);

// Save on clean exit
process.on("exit",    persist);
process.on("SIGINT",  () => { persist(); process.exit(0); });
process.on("SIGTERM", () => { persist(); process.exit(0); });

// ─────────────────────────────────────────────
//  Wrapper — mirrors the better-sqlite3 API so
//  NO controller code needs to change at all.
// ─────────────────────────────────────────────
const db = {
  // ── prepare(sql) → statement object ──────────
  prepare(sql) {
    return {
      // Returns first matching row as object, or undefined
      get(...params) {
        const stmt = _db.prepare(sql);
        stmt.bind(flattenParams(params));
        const row = stmt.step() ? stmtToObj(stmt) : undefined;
        stmt.free();
        return row;
      },
      // Returns all matching rows as array of objects
      all(...params) {
        const stmt = _db.prepare(sql);
        stmt.bind(flattenParams(params));
        const rows = [];
        while (stmt.step()) rows.push(stmtToObj(stmt));
        stmt.free();
        return rows;
      },
      // Executes INSERT / UPDATE / DELETE
      // Returns { lastInsertRowid, changes }
      run(...params) {
        const stmt = _db.prepare(sql);
        stmt.bind(flattenParams(params));
        stmt.step();
        stmt.free();
        _dirty = true;
        return {
          lastInsertRowid: _db.exec("SELECT last_insert_rowid()")[0]?.values[0][0] ?? 0,
          changes:         _db.exec("SELECT changes()")[0]?.values[0][0] ?? 0,
        };
      },
    };
  },

  // ── exec(sql) — for schema / multi-statement SQL ──
  exec(sql) {
    _db.run(sql);
    _dirty = true;
  },

  // ── pragma — ignored (sql.js handles WAL differently) ──
  pragma() {},

  // ── transaction(fn) → wrapped fn ──────────────
  transaction(fn) {
    return (...args) => {
      _db.run("BEGIN");
      try {
        const result = fn(...args);
        _db.run("COMMIT");
        _dirty = true;
        return result;
      } catch (err) {
        _db.run("ROLLBACK");
        throw err;
      }
    };
  },
};

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────

// sql.js bind() wants a flat array, not spread args
function flattenParams(params) {
  if (params.length === 0) return [];
  // If caller passed a single array, use it directly
  if (params.length === 1 && Array.isArray(params[0])) return params[0];
  return params;
}

// Convert a stepped statement into a plain JS object
function stmtToObj(stmt) {
  const cols = stmt.getColumnNames();
  const vals = stmt.get();
  const obj  = {};
  cols.forEach((col, i) => { obj[col] = vals[i]; });
  return obj;
}

// ─────────────────────────────────────────────
//  Bootstrap — load (or create) the DB file,
//  then run schema.sql to create tables.
// ─────────────────────────────────────────────
async function init() {
  const SQL = await initSqlJs();   // load WASM

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    _db = new SQL.Database(fileBuffer);
    console.log(`[DB] Loaded → ${DB_PATH}`);
  } else {
    _db = new SQL.Database();
    console.log(`[DB] Created → ${DB_PATH}`);
  }

  // Enable foreign keys
  _db.run("PRAGMA foreign_keys = ON");

  // Run schema (CREATE TABLE IF NOT EXISTS — safe to run every time)
  const schema = fs.readFileSync(
    path.join(__dirname, "schema.sql"),
    "utf8"
  );
  _db.run(schema);

  // Save fresh DB to disk
  persist();
}

// Export both the wrapper and the init promise
// so server.js can await init() before listening.
db._init = init;
module.exports = db;
