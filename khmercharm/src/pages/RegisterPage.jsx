import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle, ArrowRight, User, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 6)  { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const u = await register(name, email, password);
      toast.success(`Welcome to KhmerCharm, ${u.name}!`);
      navigate("/");
    } catch (err) {
      setError(err.message || "Could not create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen pt-16 bg-ivory grid lg:grid-cols-2">

      {/* Side panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-brown-700 via-brown-800 to-brown-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {[0,45,90,135].map((angle) => (
              <ellipse key={angle} cx="100" cy="100" rx="8" ry="40" fill="white" transform={`rotate(${angle} 100 100)`} />
            ))}
            <circle cx="100" cy="100" r="14" fill="white" />
          </svg>
        </div>
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 to-clay-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl font-bold">KhmerCharm</span>
          </Link>
        </div>
        <div className="relative z-10 space-y-4">
          <h2 className="font-display text-3xl font-bold leading-tight">Join the family 🌸</h2>
          <p className="text-ivory/70 max-w-sm">Create an account to enjoy member-only deals, faster checkout, and your own wishlist.</p>
          <div className="space-y-2 pt-2">
            {[
              "10% off your first order",
              "Save your wishlist forever",
              "Track orders in real-time",
              "Early access to new collections",
            ].map((b) => (
              <div key={b} className="flex items-center gap-2 text-sm text-ivory/80">
                <CheckCircle2 className="w-4 h-4 text-gold-400" /> {b}
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-xs text-ivory/40">
          🪷 Handmade in Phnom Penh
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-brown-900">Create your account</h1>
            <p className="text-brown-500 mt-1 text-sm">Get 10% off your first order when you sign up</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-clay-50 border border-clay-200 rounded-xl text-sm text-clay-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-brown-700 uppercase tracking-wide">Full Name</label>
              <div className="flex items-center gap-2 bg-white border border-gold-200 focus-within:border-gold-400 rounded-xl px-4 py-3 transition-colors">
                <User className="w-4 h-4 text-brown-400" />
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Sreynich Mao"
                  className="flex-1 bg-transparent outline-none text-sm text-brown-900 placeholder:text-brown-300" />
              </div>
            </div>

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
                  placeholder="At least 6 characters"
                  className="flex-1 bg-transparent outline-none text-sm text-brown-900 placeholder:text-brown-300" />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="text-brown-400 hover:text-brown-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-brown-700 uppercase tracking-wide">Confirm Password</label>
              <div className="flex items-center gap-2 bg-white border border-gold-200 focus-within:border-gold-400 rounded-xl px-4 py-3 transition-colors">
                <Lock className="w-4 h-4 text-brown-400" />
                <input type={showPw ? "text" : "password"} required value={confirm} onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat your password"
                  className="flex-1 bg-transparent outline-none text-sm text-brown-900 placeholder:text-brown-300" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 disabled:opacity-60 text-white font-semibold rounded-xl shadow-md transition-all">
              {loading ? "Creating…" : "Create Account"} {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <p className="text-center text-sm text-brown-500">
            Already have an account?{" "}
            <Link to="/login" className="text-gold-700 hover:text-gold-600 font-semibold">Sign in</Link>
          </p>

          <p className="text-center text-[11px] text-brown-400">
            By creating an account, you agree to our <span className="underline">Terms</span> and <span className="underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </section>
  );
}
