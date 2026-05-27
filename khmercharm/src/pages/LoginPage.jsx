import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const u = await login(email, password);
      toast.success(`Welcome back, ${u.name}!`);
      navigate(u.role === "admin" ? "/admin" : redirect);
    } catch (err) {
      setError(err.message || "Could not sign in.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === "admin") { setEmail("admin@khmercharm.com"); setPassword("admin123"); }
    else                  { setEmail("customer@khmercharm.com"); setPassword("customer123"); }
    setError("");
  };

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
            <div className="flex items-center gap-2 p-3 bg-clay-50 border border-clay-200 rounded-xl text-sm text-clay-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-brown-700 uppercase tracking-wide">Email</label>
              <div className="flex items-center gap-2 bg-white border border-gold-200 focus-within:border-gold-400 rounded-xl px-4 py-3 transition-colors">
                <Mail className="w-4 h-4 text-brown-400" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 bg-transparent outline-none text-sm text-brown-900 placeholder:text-brown-300" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-brown-700 uppercase tracking-wide">Password</label>
              <div className="flex items-center gap-2 bg-white border border-gold-200 focus-within:border-gold-400 rounded-xl px-4 py-3 transition-colors">
                <Lock className="w-4 h-4 text-brown-400" />
                <input type={showPw ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="flex-1 bg-transparent outline-none text-sm text-brown-900 placeholder:text-brown-300" />
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

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 disabled:opacity-60 text-white font-semibold rounded-xl shadow-md transition-all">
              {loading ? "Signing in…" : "Sign In"} {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="border-t border-gold-100 pt-4 space-y-2">
            <p className="text-center text-xs text-brown-400 font-medium">— Demo accounts —</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => fillDemo("customer")} className="py-2 text-xs font-semibold bg-gold-50 hover:bg-gold-100 text-gold-700 border border-gold-200 rounded-lg transition-colors">
                👤 Customer Demo
              </button>
              <button onClick={() => fillDemo("admin")} className="py-2 text-xs font-semibold bg-clay-50 hover:bg-clay-100 text-clay-700 border border-clay-200 rounded-lg transition-colors">
                🛡️ Admin Demo
              </button>
            </div>
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
