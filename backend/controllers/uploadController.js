// ============================================================
//  KhmerCharm — Upload Controller
//
//  Two Multer instances are configured here:
//    multerDemo   — ⚠️ VULNERABLE (no restrictions)
//    multerSecure — ✅ SECURE (images only, size-limited, safe names)
// ============================================================

const multer = require("multer");
const path   = require("path");
const fs     = require("fs");
const { v4: uuidv4 } = require("uuid");

// Ensure uploads directory exists
const UPLOAD_DIR = path.join(__dirname, "../uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ─────────────────────────────────────────────
//  ⚠️ VULNERABLE Multer config
//  Accepts ANY file type, ANY size, keeps original filename.
//
//  WHY THIS IS DANGEROUS:
//    1. An attacker can upload a .php / .js / .sh shell script.
//    2. If the server executes uploaded files (e.g. via /uploads/shell.php),
//       the attacker achieves Remote Code Execution (RCE).
//    3. Original filenames can contain path traversal: ../../etc/passwd
//    4. No size limit → disk exhaustion / DoS attack.
//
//  FIX: See multerSecure below.
// ─────────────────────────────────────────────
const storageDemo = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    // ⚠️ VULNERABLE DEMO:
    // Keeping original filename — path traversal + malicious extension possible.
    // Do NOT do this in production.
    cb(null, file.originalname);
  },
});

// ⚠️ No file filter, no size limit
const multerDemo = multer({ storage: storageDemo });

// ─────────────────────────────────────────────
//  ✅ SECURE Multer config
//  - Whitelist: jpg, jpeg, png, webp only
//  - 2 MB size limit
//  - UUID-based filename (no path traversal, no extension spoofing)
// ─────────────────────────────────────────────
const storageSecure = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    // ✅ Safe filename: uuid + whitelisted extension only
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

const ALLOWED_MIME   = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ALLOWED_EXTS   = [".jpg", ".jpeg", ".png", ".webp"];
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

// ✅ Secure file filter — check both MIME type and extension
const secureFileFilter = (_req, file, cb) => {
  const ext  = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (ALLOWED_MIME.includes(mime) && ALLOWED_EXTS.includes(ext)) {
    cb(null, true); // accept
  } else {
    cb(
      new Error(
        `Invalid file type. Allowed types: ${ALLOWED_EXTS.join(", ")}. Received: ${ext} (${mime})`
      ),
      false
    );
  }
};

const multerSecure = multer({
  storage: storageSecure,
  fileFilter: secureFileFilter,
  limits: { fileSize: MAX_SIZE_BYTES },
});

// ─────────────────────────────────────────────
//  ⚠️ VULNERABLE Handler
//  POST /api/upload/demo
// ─────────────────────────────────────────────
const demoUploadVulnerable = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded." });
  }

  // ⚠️ VULNERABLE DEMO:
  // This is intentionally weak for school demonstration.
  // Do not use in production.
  // No auth check, no file type validation, original filename kept.
  console.warn("[⚠️  VULNERABLE UPLOAD] File accepted:", req.file.originalname, req.file.mimetype);

  return res.json({
    success: true,
    warning: "⚠️ VULNERABLE ENDPOINT — No auth, no type check, original filename kept! (DEMO ONLY)",
    message: "File uploaded (vulnerable demo). In a real attack, a .php shell could now be executed.",
    data: {
      filename:  req.file.filename,
      original:  req.file.originalname,
      mimetype:  req.file.mimetype,
      size:      req.file.size,
      path:      `/uploads/${req.file.filename}`,
    },
  });
};

// ─────────────────────────────────────────────
//  ✅ SECURE Handler
//  POST /api/upload/secure
// ─────────────────────────────────────────────
const secureUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded." });
  }

  return res.json({
    success: true,
    message: "✅ File uploaded securely. Type validated, size limited, filename randomised.",
    data: {
      filename: req.file.filename,          // uuid-based safe name
      mimetype: req.file.mimetype,
      size:     req.file.size,
      url:      `/uploads/${req.file.filename}`,
    },
  });
};

module.exports = { multerDemo, multerSecure, demoUploadVulnerable, secureUpload };
