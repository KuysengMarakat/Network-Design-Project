import { useState } from "react";
import { X, User, Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LoginModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const [mode,     setMode]     = useState("login"); // "login" | "register"
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  if (!isOpen) return null;

  const reset = () => { setName(""); setEmail(""); setPassword(""); setError(""); setShowPw(false); };
  const switchMode = (m) => { setMode(m); reset(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        if (!name.trim()) { setError("Please enter your name."); setLoading(false); return; }
        await register(name, email, password);
      }
      reset();
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === "admin") { setEmail("admin@khmercharm.com");    setPassword("admin123"); }
    else                  { setEmail("customer@khmercharm.com"); setPassword("customer123"); }
    setError("");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-brown-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-ivory rounded-3xl shadow-2xl overflow-hidden">
        {/* Top gradient bar */}
        <div className="h-1 bg-gradient-to-r from-clay-400 via-gold-400 to-khmer-green-500" />

        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold-400 to-clay-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-brown-900">
                {mode === "login" ? "Welcome back" : "Create account"}
              </h2>
              <p className="text-xs text-brown-500 mt-0.5">
                {mode === "login" ? "Sign in to KhmerCharm" : "Join KhmerCharm today"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-brown-100 text-brown-400 hover:text-brown-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 mb-4">
          <div className="flex bg-ivory-dark rounded-xl p-1 gap-1">
            {["login", "register"].map((m) => (
              <button key={m} onClick={() => switchMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  mode === m ? "bg-white text-brown-900 shadow-sm" : "text-brown-500 hover:text-brown-700"
                }`}>
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-clay-50 border border-clay-200 rounded-xl text-sm text-clay-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Name field (register only) */}
          {mode === "register" && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-brown-700 uppercase tracking-wide">Full Name</label>
              <div className="flex items-center gap-2 bg-white border border-gold-200 focus-within:border-gold-400 rounded-xl px-4 py-3 transition-colors">
                <User className="w-4 h-4 text-brown-400 flex-shrink-0" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Your name" required
                  className="flex-1 bg-transparent text-sm text-brown-900 placeholder:text-brown-300 outline-none" />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-brown-700 uppercase tracking-wide">Email</label>
            <div className="flex items-center gap-2 bg-white border border-gold-200 focus-within:border-gold-400 rounded-xl px-4 py-3 transition-colors">
              <Mail className="w-4 h-4 text-brown-400 flex-shrink-0" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com" required
                className="flex-1 bg-transparent text-sm text-brown-900 placeholder:text-brown-300 outline-none" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-brown-700 uppercase tracking-wide">Password</label>
            <div className="flex items-center gap-2 bg-white border border-gold-200 focus-within:border-gold-400 rounded-xl px-4 py-3 transition-colors">
              <Lock className="w-4 h-4 text-brown-400 flex-shrink-0" />
              <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "register" ? "Min 6 characters" : "Your password"} required
                className="flex-1 bg-transparent text-sm text-brown-900 placeholder:text-brown-300 outline-none" />
              <button type="button" onClick={() => setShowPw((v) => !v)} className="text-brown-400 hover:text-brown-600">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 disabled:opacity-60 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
            {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
          </button>

          {/* Demo credentials (only for login) */}
          {mode === "login" && (
            <div className="pt-2 border-t border-gold-100 space-y-2">
              <p className="text-center text-xs text-brown-400 font-medium">— Demo accounts —</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => fillDemo("customer")}
                  className="flex-1 py-2 text-xs font-semibold bg-gold-50 hover:bg-gold-100 text-gold-700 border border-gold-200 rounded-lg transition-colors">
                  👤 Customer Demo
                </button>
                <button type="button" onClick={() => fillDemo("admin")}
                  className="flex-1 py-2 text-xs font-semibold bg-clay-50 hover:bg-clay-100 text-clay-700 border border-clay-200 rounded-lg transition-colors">
                  🛡️ Admin Demo
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
