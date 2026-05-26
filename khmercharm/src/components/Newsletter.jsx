import { useState } from "react";
import { Mail, Send, Check } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-brown-800 via-brown-900 to-brown-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent" />
        {/* Lotus bg */}
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-64 h-64 opacity-5">
          <svg viewBox="0 0 200 200" fill="none">
            {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle) => {
              const rad = angle * Math.PI / 180;
              return (
                <ellipse key={angle}
                  cx={100 + Math.cos(rad) * 60} cy={100 + Math.sin(rad) * 60}
                  rx="10" ry="35" fill="white"
                  transform={`rotate(${angle} ${100 + Math.cos(rad)*60} ${100 + Math.sin(rad)*60})`}
                />
              );
            })}
            <circle cx="100" cy="100" r="18" fill="white" />
          </svg>
        </div>
        <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-48 h-48 opacity-5">
          <svg viewBox="0 0 200 200" fill="none">
            {[0,45,90,135,180,225,270,315].map((angle) => {
              const rad = angle * Math.PI / 180;
              return (
                <ellipse key={angle}
                  cx={100 + Math.cos(rad) * 50} cy={100 + Math.sin(rad) * 50}
                  rx="8" ry="28" fill="white"
                  transform={`rotate(${angle} ${100 + Math.cos(rad)*50} ${100 + Math.sin(rad)*50})`}
                />
              );
            })}
            <circle cx="100" cy="100" r="14" fill="white" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gold-400/20 border border-gold-400/30 mx-auto">
          <Mail className="w-6 h-6 text-gold-400" />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Get New Arrivals &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">
              Special Offers
            </span>
          </h2>
          <p className="text-ivory/60 text-base">
            Subscribe to our newsletter and be the first to know about new collections, exclusive deals, and Cambodian craft stories.
          </p>
        </div>

        {/* Perks */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-ivory/50">
          {["Free shipping on first order", "10% off welcome discount", "Early access to new drops"].map((perk) => (
            <div key={perk} className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-gold-400" />
              {perk}
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <div className={`flex-1 flex items-center gap-2 bg-white/10 backdrop-blur-sm border rounded-xl px-4 py-3 transition-all duration-200 ${
            focused ? "border-gold-400 bg-white/15" : "border-white/20"
          }`}>
            <Mail className="w-4 h-4 text-gold-400/70 flex-shrink-0" />
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="flex-1 bg-transparent text-white placeholder:text-white/40 text-sm outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className={`flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl shadow-lg transition-all duration-300 whitespace-nowrap ${
              subscribed
                ? "bg-khmer-green-500 text-white"
                : "bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-brown-900 hover:shadow-xl"
            }`}
          >
            {subscribed ? (
              <>
                <Check className="w-4 h-4" />
                Subscribed!
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Subscribe
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-ivory/30">
          No spam, ever. Unsubscribe anytime. 🇰🇭
        </p>
      </div>
    </section>
  );
}
