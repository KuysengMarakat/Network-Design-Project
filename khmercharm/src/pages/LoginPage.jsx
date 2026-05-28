import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

// Demo credentials — these match the auto-seeded users in the backend.
// Backend auto-seeds them on first start (see backend/server.js autoSeedIfEmpty()).
const DEMO_ACCOUNTS = {
  customer: { email: "customer@khmercharm.com", password: "customer123", label: "Customer" },
  admin:    { email: "admin@khmercharm.com",    password: "admin123",    label: "Admin"    },
};

function AuthSidePanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-brown-700 via-brown-800 to-brown-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {[0,30,60,90,120,150].map((angle) => (
            <ellipse key={angle} cx="100" cy="100" rx="8" ry="40" fill="white" transform={`rotate(${angle} 100 100)`} />
          ))}
          <circle cx="100" cy="100" r="14" fill="white" />
        </svg>
      </div>
      <div className="relative z-10">
        <Link to="/" className="flex items-center gap-2 mb-12">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 to-clay-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-xl font-bold">KhmerCharm</span>
        </Link>
      </div>
      <div className="relative z-10 space-y-3">
        <h2 className="font-display text-3xl font-bold leading-tight">Welcome to the<br /> Khmer Charm family 🇰🇭</h2>
        <p className="text-ivory/70 max-w-sm">Sign in to view your orders, save favourites to your wishlist, and check out faster every time.</p>
        <div className="flex gap-2 pt-4">
          {["✓ Free returns", "✓ Track orders", "✓ Member discounts"].map((b) => (
            <span key={b} className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs">{b}</span>
          ))}
        </div>
      </div>
      <div className="relative z-10 text-xs text-ivory/40">
        🪷 Handmade in Phnom Penh
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  // Tracks which demo button is currently logging in: null | "customer" | "admin"
  const [demoLoading, setDemoLoading] = useState(null);

  // ─── Centralised login + redirect helper ────────────────────
  // Used by both the manual form and the demo buttons so they
  // hit the same real backend endpoint and follow the same rules.
  const performLogin = async (loginEmail, loginPassword) => {
    const user = await login(loginEmail, loginPassword);   // calls /api/auth/login
    toast.success(`Welcome back, ${user.name}!`);
    // Role-based redirect — the admin guard in App.jsx will block
    // non-admins from /admin even if they manipulate the URL.
    if (user.role === "admin") {
      navigate("/admin", { replace: true });
    } else {
      navigate(redirect, { replace: true });
    }
    return user;
  };

  // ─── Manual sign-in form ────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || demoLoading) return;
    setError("");
    setLoading(true);
    try {
      await performLogin(email, password);
    } catch (err) {
      setError(err.message || "Could not sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── One-click demo login ──────────────────────────────────
  // Calls the real /api/auth/login endpoint with seeded credentials.
  // The JWT is stored in localStorage (handled by AuthContext).
  const loginAsDemo = async (role) => {
    if (loading || demoLoading) return;
    const account = DEMO_ACCOUNTS[role];
    if (!account) return;

    setError("");
    setDemoLoading(role);

    // Show the credentials in the form so the user can see what is
    // being submitted — useful for class demos and debugging.
    setEmail(account.email);
    setPassword(account.password);

    try {
      await performLogin(account.email, account.password);
    } catch (err) {
      const isFetchFail = (err.message || "").toLowerCase().includes("failed to fetch");
      setError(
        isFetchFail
          ? "Could not reach the server. The backend might be sleeping — please wait ~30 seconds and try again."
          : err.message || `Could not log in as ${account.label}. Please try again.`
      );
    } finally {
      setDemoLoading(null);
    }
  };

  const isBusy = loading || demoLoading !== null;

  return (
    <section className="min-h-screen pt-16 bg-ivory grid lg:grid-cols-2">
      <AuthSidePanel />

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-brown-900">Welcome back</h1>
            <p className="text-brown-500 mt-1 text-sm">Sign in to continue your KhmerCharm journey</p>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-clay-50 border border-clay-200 rounded-xl text-sm text-clay-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-brown-700 uppercase tracking-wide">Email</label>
              <div className="flex items-center gap-2 bg-white border border-gold-200 focus-within:border-gold-400 rounded-xl px-4 py-3 transition-colors">
                <Mail className="w-4 h-4 text-brown-400" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  disabled={isBusy}
                  placeholder="your@email.com"
                  className="flex-1 bg-transparent outline-none text-sm text-brown-900 placeholder:text-brown-300 disabled:opacity-60" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-brown-700 uppercase tracking-wide">Password</label>
              <div className="flex items-center gap-2 bg-white border border-gold-200 focus-within:border-gold-400 rounded-xl px-4 py-3 transition-colors">
                <Lock className="w-4 h-4 text-brown-400" />
                <input type={showPw ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                  disabled={isBusy}
                  placeholder="Your password"
                  className="flex-1 bg-transparent outline-none text-sm text-brown-900 placeholder:text-brown-300 disabled:opacity-60" />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="text-brown-400 hover:text-brown-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 text-brown-600 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-gold-500" />
                Remember me
              </label>
              <button type="button" className="text-gold-700 hover:text-gold-600 font-semibold">Forgot password?</button>
            </div>

            <button type="submit" disabled={isBusy}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-md transition-all">
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
                : <>Sign In <ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>

          {/* ── One-click demo logins (real backend, real DB, real JWT) ── */}
          <div className="border-t border-gold-100 pt-4 space-y-2">
            <p className="text-center text-xs text-brown-400 font-medium">— Try the demo with one click —</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => loginAsDemo("customer")}
                disabled={isBusy}
                className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold bg-gold-50 hover:bg-gold-100 text-gold-700 border border-gold-200 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {demoLoading === "customer"
                  ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Signing in…</>
                  : <>👤 Customer Demo</>
                }
              </button>
              <button
                type="button"
                onClick={() => loginAsDemo("admin")}
                disabled={isBusy}
                className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold bg-clay-50 hover:bg-clay-100 text-clay-700 border border-clay-200 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {demoLoading === "admin"
                  ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Signing in…</>
                  : <>🛡️ Admin Demo</>
                }
              </button>
            </div>
            <p className="text-center text-[10px] text-brown-400">
              Click a button to instantly log in with real credentials
            </p>
          </div>

          <p className="text-center text-sm text-brown-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-gold-700 hover:text-gold-600 font-semibold">Create one</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
