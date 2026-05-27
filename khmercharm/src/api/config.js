// ─────────────────────────────────────────────
//  KhmerCharm — API base URL
//
//  Reads from an environment variable so the same code works
//  in both local development and production (Vercel).
//
//  Local dev: create khmercharm/.env.local with
//      VITE_API_BASE=http://localhost:5000/api
//
//  Production (Vercel):
//      Add VITE_API_BASE in the project's Environment Variables.
//      Example: https://your-backend.onrender.com/api
//
//  If no env var is set, falls back to localhost:5000.
// ─────────────────────────────────────────────
export const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
