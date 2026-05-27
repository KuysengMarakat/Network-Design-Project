import { Link } from "react-router-dom";
import { ShoppingBag, BookOpen, Star, ArrowRight } from "lucide-react";

// Khmer decorative SVG pattern
function KhmerPattern({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g opacity="0.15">
        {[0,30,60,90,120,150].map((angle) => (
          <ellipse key={angle} cx="100" cy="100" rx="8" ry="30" fill="#d4a017" transform={`rotate(${angle} 100 100)`} />
        ))}
        <circle cx="100" cy="100" r="10" fill="#bf3a1e" opacity="0.6" />
      </g>
      <g opacity="0.1">
        <path d="M10,10 Q30,10 30,30 Q30,10 50,10" stroke="#d4a017" strokeWidth="2" fill="none" />
        <path d="M190,10 Q170,10 170,30 Q170,10 150,10" stroke="#d4a017" strokeWidth="2" fill="none" />
        <path d="M10,190 Q30,190 30,170 Q30,190 50,190" stroke="#d4a017" strokeWidth="2" fill="none" />
        <path d="M190,190 Q170,190 170,170 Q170,190 150,190" stroke="#d4a017" strokeWidth="2" fill="none" />
      </g>
    </svg>
  );
}

// Lotus illustration for image area
function LotusIllustration() {
  return (
    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fdf8ee" />
          <stop offset="100%" stopColor="#f0ebe0" />
        </radialGradient>
        <radialGradient id="lotusGrad" cx="50%" cy="70%" r="50%">
          <stop offset="0%" stopColor="#f4a98a" />
          <stop offset="100%" stopColor="#d4a017" />
        </radialGradient>
      </defs>
      <rect width="300" height="300" fill="url(#bgGrad)" rx="24" />
      <rect x="12" y="12" width="276" height="276" rx="18" stroke="#d4a017" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4" />
      <g transform="translate(150, 165)">
        <ellipse cx="-32" cy="-45" rx="12" ry="38" fill="#f4a98a" opacity="0.5" transform="rotate(-25 -32 -45)" />
        <ellipse cx="32" cy="-45" rx="12" ry="38" fill="#f4a98a" opacity="0.5" transform="rotate(25 32 -45)" />
        <ellipse cx="-52" cy="-20" rx="10" ry="34" fill="#e8c04a" opacity="0.4" transform="rotate(-50 -52 -20)" />
        <ellipse cx="52" cy="-20" rx="10" ry="34" fill="#e8c04a" opacity="0.4" transform="rotate(50 52 -20)" />
        <ellipse cx="-20" cy="-55" rx="14" ry="42" fill="#eb7550" opacity="0.7" transform="rotate(-15 -20 -55)" />
        <ellipse cx="20" cy="-55" rx="14" ry="42" fill="#eb7550" opacity="0.7" transform="rotate(15 20 -55)" />
        <ellipse cx="0" cy="-60" rx="15" ry="45" fill="#d95030" opacity="0.8" />
        <circle cx="0" cy="-15" r="18" fill="url(#lotusGrad)" />
        <circle cx="0" cy="-15" r="12" fill="#d4a017" opacity="0.9" />
        <circle cx="0" cy="-15" r="6" fill="#fdf8ee" opacity="0.8" />
        <path d="M0 5 Q-10 30 -5 60 Q0 80 5 60 Q10 30 0 5" fill="#226638" opacity="0.7" />
        <ellipse cx="-35" cy="45" rx="28" ry="12" fill="#3a8551" opacity="0.5" transform="rotate(-20 -35 45)" />
        <ellipse cx="35" cy="50" rx="25" ry="10" fill="#226638" opacity="0.4" transform="rotate(15 35 50)" />
      </g>
      {[[40,40],[250,60],[260,220],[50,240],[150,30]].map(([x,y],i) => (
        <g key={i} transform={`translate(${x},${y})`} opacity="0.3">
          <line x1="-5" y1="0" x2="5" y2="0" stroke="#d4a017" strokeWidth="1.5" />
          <line x1="0" y1="-5" x2="0" y2="5" stroke="#d4a017" strokeWidth="1.5" />
        </g>
      ))}
      <text x="150" y="258" textAnchor="middle" fontSize="9" fill="#8f5d2c" opacity="0.5" fontFamily="serif">
        ✦ KhmerCharm ✦
      </text>
    </svg>
  );
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden bg-ivory lotus-pattern"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-gold-200/30 to-clay-200/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-tr from-khmer-green-200/20 to-gold-200/20 blur-3xl" />
        <KhmerPattern className="absolute top-10 right-10 w-48 h-48 opacity-40" />
        <KhmerPattern className="absolute bottom-20 left-10 w-32 h-32 opacity-30" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-200/50 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Text */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-100 border border-gold-200 rounded-full text-gold-700 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
              Handcrafted in Cambodia 🇰🇭
            </div>

            <div className="space-y-3">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-brown-900 leading-tight">
                Elegant Accessories{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-clay-500 to-gold-600">
                  Inspired by
                </span>{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-clay-600 to-brown-700">
                  Cambodia
                </span>
              </h1>
              <div className="w-20 h-1 bg-gradient-to-r from-gold-400 to-clay-400 rounded-full" />
            </div>

            <p className="text-lg text-brown-600 leading-relaxed max-w-lg">
              Discover modern and handmade accessories with Khmer charm, crafted for everyday beauty. Each piece carries the spirit of Cambodian artistry.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Handmade",     bg: "bg-clay-50",        text: "text-clay-700",        border: "border-clay-200" },
                { label: "Local Design", bg: "bg-khmer-green-50", text: "text-khmer-green-700", border: "border-khmer-green-200" },
                { label: "Fast Delivery",bg: "bg-gold-50",        text: "text-gold-700",        border: "border-gold-200" },
              ].map((b) => (
                <span key={b.label} className={`px-3 py-1 rounded-full text-xs font-semibold border ${b.bg} ${b.text} ${b.border}`}>
                  ✓ {b.label}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              {[
                { value: "500+", label: "Products" },
                { value: "2k+",  label: "Customers" },
                { value: "100%", label: "Handmade" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-display text-2xl font-bold text-gold-600">{stat.value}</div>
                  <div className="text-xs text-brown-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Star rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <span className="text-sm text-brown-600">
                <strong className="text-brown-800">4.9/5</strong> from over 2,000 reviews
              </span>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="group flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white font-semibold rounded-xl shadow-lg shadow-gold-200 hover:shadow-xl hover:shadow-gold-300 transition-all duration-300 hover:-translate-y-0.5">
                <ShoppingBag className="w-5 h-5" />
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/collections" className="flex items-center gap-2 px-8 py-3.5 bg-white border-2 border-gold-300 hover:border-gold-500 text-brown-700 hover:text-gold-700 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                <BookOpen className="w-5 h-5" />
                Explore Collections
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-80 h-80 rounded-full border-2 border-dashed border-gold-200/60 animate-spin" style={{ animationDuration: "30s" }} />
            <div className="absolute w-64 h-64 rounded-full border border-clay-200/40 animate-spin" style={{ animationDuration: "20s", animationDirection: "reverse" }} />

            <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-3xl overflow-hidden shadow-2xl shadow-brown-200/50 border border-gold-200/50">
              <LotusIllustration />
            </div>

            <div className="absolute top-4 -left-4 bg-white rounded-2xl shadow-lg shadow-brown-100 p-3 flex items-center gap-2.5 border border-gold-100">
              <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center text-sm">💛</div>
              <div>
                <div className="text-xs font-bold text-brown-800">New Arrivals</div>
                <div className="text-[10px] text-brown-500">12 items this week</div>
              </div>
            </div>

            <div className="absolute bottom-8 -right-4 bg-white rounded-2xl shadow-lg shadow-brown-100 p-3 flex items-center gap-2.5 border border-gold-100">
              <div className="w-8 h-8 rounded-full bg-clay-100 flex items-center justify-center text-sm">🌸</div>
              <div>
                <div className="text-xs font-bold text-brown-800">Free Delivery</div>
                <div className="text-[10px] text-brown-500">Orders over $25</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0,30 Q360,60 720,30 Q1080,0 1440,30 L1440,60 L0,60 Z" fill="#f0ebe0" opacity="0.5" />
        </svg>
      </div>
    </section>
  );
}
