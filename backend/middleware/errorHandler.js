// ============================================================
//  KhmerCharm — Global Error Handler
//  Registered as the LAST middleware in server.js.
//
//  ⚠️ VULNERABLE DEMO: In development mode, the full error
//     stack trace is returned in the API response so you can
//     easily see what went wrong during demos.
//  FIX: In production, NEVER send stack traces to clients.
//       Log errors server-side (e.g. Winston → SIEM) and
//       return only generic messages.
// ============================================================

const errorHandler = (err, req, res, _next) => {
  // Log to server console (useful for demo monitoring)
  console.error(`[ERROR] ${req.method} ${req.originalUrl}`);
  console.error(err.stack || err.message);

  const statusCode = err.statusCode || err.status || 500;
  const isDev      = (process.env.NODE_ENV || "development") === "development";

  const response = {
    success: false,
    message: err.message || "Internal server error",
  };

  // ⚠️ VULNERABLE DEMO: exposing stack trace in dev
  // FIX: Remove the 'stack' field entirely in production
  if (isDev) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
