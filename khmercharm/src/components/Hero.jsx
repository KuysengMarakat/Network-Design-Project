import { ShoppingBag, BookOpen, Star, ArrowRight } from "lucide-react";

// Khmer decorative SVG pattern
function KhmerPattern({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Lotus petal group */}
      <g opacity="0.15">
        <ellipse cx="100" cy="100" rx="8" ry="30" fill="#d4a017" transform="rotate(0 100 100)" />
        <ellipse cx="100" cy="100" rx="8" ry="30" fill="#d4a017" transform="rotate(30 100 100)" />
        <ellipse cx="100" cy="100" rx="8" ry="30" fill="#d4a017" transform="rotate(60 100 100)" />
        <ellipse cx="100" cy="100" rx="8" ry="30" fill="#d4a017" transform="rotate(90 100 100)" />
        <ellipse cx="100" cy="100" rx="8" ry="30" fill="#d4a017" transform="rotate(120 100 100)" />
        <ellipse cx="100" cy="100" rx="8" ry="30" fill="#d4a017" transform="rotate(150 100 100)" />
        <circle cx="100" cy="100" r="10" fill="#bf3a1e" opacity="0.6" />
      </g>
      {/* Corner decorations */}
      <g opacity="0.1">
        <path d="M10,10 Q30,10 30,30 Q30,10 50,10" stroke="#d4a017" strokeWidth="2" fill="none" />
        <path d="M190,10 Q170,10 170,30 Q170,10 150,10" stroke="#d4a017" strokeWidth="2" fill="none" />
        <path d="M10,190 Q30,190 30,170 Q30,190 50,190" stroke="#d4a017" strokeWidth="2" fill="none" />
        <path d="M190,190 Q170,190 170,170 Q170,190 150,190" stroke="#d4a017" strokeWidth="2" fill="none" />
      </g>
    </svg>
  );
}

// Decorative lotus SVG for image placeholder
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

      {/* Silk texture overlay */}
      <rect width="300" height="300" fill="url(#bgGrad)" rx="24" opacity="0.5"
        style={{backgroundImage: "repeating-linear-gradient(45deg,transparent,transparent 2px,rgba(212,160,23,0.05) 2px,rgba(212,160,23,0.05) 4px)"}}
      />

      {/* Decorative border */}
      <rect x="12" y="12" width="276" height="276" rx="18" stroke="#d4a017" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4" />
      <rect x="18" y="18" width="264" height="264" rx="14" stroke="#bf3a1e" strokeWidth="0.8" strokeDasharray="3 6" opacity="0.2" />

      {/* Lotus flower center */}
      <g transform="translate(150, 165)">
        {/* Petals - back row */}
        <ellipse cx="-32" cy="-45" rx="12" ry="38" fill="#f4a98a" opacity="0.5" transform="rotate(-25 -32 -45)" />
        <ellipse cx="32" cy="-45" rx="12" ry="38" fill="#f4a98a" opacity="0.5" transform="rotate(25 32 -45)" />
        <ellipse cx="-52" cy="-20" rx="10" ry="34" fill="#e8c04a" opacity="0.4" transform="rotate(-50 -52 -20)" />
        <ellipse cx="52" cy="-20" rx="10" ry="34" fill="#e8c04a" opacity="0.4" transform="rotate(50 52 -20)" />

        {/* Petals - front row */}
        <ellipse cx="-20" cy="-55" rx="14" ry="42" fill="#eb7550" opacity="0.7" transform="rotate(-15 -20 -55)" />
        <ellipse cx="20" cy="-55" rx="14" ry="42" fill="#eb7550" opacity="0.7" transform="rotate(15 20 -55)" />
        <ellipse cx="0" cy="-60" rx="15" ry="45" fill="#d95030" opacity="0.8" />

        {/* Center */}
        <circle cx="0" cy="-15" r="18" fill="url(#lotusGrad)" />
        <circle cx="0" cy="-15" r="12" fill="#d4a017" opacity="0.9" />
        <circle cx="0" cy="-15" r="6" fill="#fdf8ee" opacity="0.8" />

        {/* Stamens */}
        {[-8,-4,0,4,8].map((x, i) => (
          <line key={i} x1={x} y1="-15" x2={x * 1.5} y2="-35" stroke="#b8860b" strokeWidth="1" opacity="0.6" />
        ))}

        {/* Stem */}
        <path d="M0 5 Q-10 30 -5 60 Q0 80 5 60 Q10 30 0 5" fill="#226638" opacity="0.7" />

        {/* Leaves */}
        <ellipse cx="-35" cy="45" rx="28" ry="12" fill="#3a8551" opacity="0.5" transform="rotate(-20 -35 45)" />
        <ellipse cx="35" cy="50" rx="25" ry="10" fill="#226638" opacity="0.4" transform="rotate(15 35 50)" />
      </g>

      {/* Gold bracelet illustration */}
      <g transform="translate(80, 100)" opacity="0.85">
        <ellipse cx="0" cy="0" rx="28" ry="10" stroke="#d4a017" strokeWidth="3" fill="none" />
        <ellipse cx="0" cy="0" rx="28" ry="10" stroke="#b8860b" strokeWidth="1" fill="none" strokeDasharray="4 3" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = 28 * Math.cos(rad);
          const y = 10 * Math.sin(rad);
          return <circle key={i} cx={x} cy={y} r="2.5" fill="#d4a017" />;
        })}
      </g>

      {/* Pearl necklace */}
      <g transform="translate(200, 90)" opacity="0.8">
        <path d="M-30,0 Q0,-40 30,0" stroke="none" fill="none" id="necklacePath" />
        {[-30,-20,-10,0,10,20,30].map((x, i) => {
          const y = -Math.sqrt(Math.max(0, 900 - x*x)) * 0.4 + 20;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="4" fill="#faf7f0" stroke="#d4a017" strokeWidth="0.8" />
              <circle cx={x-1} cy={y-1} r="1" fill="white" opacity="0.7" />
            </g>
          );
        })}
      </g>

      {/* Angkor Wat silhouette - bottom */}
      <g transform="translate(150, 270)" opacity="0.12" fill="#6e4318">
        {/* Main tower */}
        <rect x="-8" y="-45" width="16" height="45" />
        <polygon points="-10,-45 10,-45 6,-65 -6,-65" />
        <polygon points="-6,-65 6,-65 3,-78 -3,-78" />
        {/* Side towers */}
        <rect x="-38" y="-30" width="10" height="30" />
        <polygon points="-40,-30 -28,-30 -31,-45 -37,-45" />
        <rect x="28" y="-30" width="10" height="30" />
        <polygon points="28,-30 40,-30 37,-45 31,-45" />
        {/* Base */}
        <rect x="-55" y="-10" width="110" height="10" />
        <rect x="-70" y="0" width="140" height="6" />
      </g>

      {/* Floating sparkles */}
      {[[40,40],[250,60],[260,220],[50,240],[150,30]].map(([x,y],i) => (
        <g key={i} transform={`translate(${x},${y})`} opacity="0.3">
          <line x1="-5" y1="0" x2="5" y2="0" stroke="#d4a017" strokeWidth="1.5" />
          <line x1="0" y1="-5" x2="0" y2="5" stroke="#d4a017" strokeWidth="1.5" />
          <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5" stroke="#d4a017" strokeWidth="0.8" />
          <line x1="3.5" y1="-3.5" x2="-3.5" y2="3.5" stroke="#d4a017" strokeWidth="0.8" />
        </g>
      ))}

      {/* Labels */}
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
      className="relative min-h-screen flex items-center overflow-hidden bg-ivory lotus-pattern pt-16"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-gold-200/30 to-clay-200/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-tr from-khmer-green-200/20 to-gold-200/20 blur-3xl" />
        <KhmerPattern className="absolute top-10 right-10 w-48 h-48 opacity-40" />
        <KhmerPattern className="absolute bottom-20 left-10 w-32 h-32 opacity-30" />

        {/* Decorative horizontal line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-200/50 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Text content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-100 border border-gold-200 rounded-full text-gold-700 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
              Handcrafted in Cambodia 🇰🇭
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-brown-900 leading-tight">
                Elegant Accessories{" "}
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-clay-500 to-gold-600">
                    Inspired by
                  </span>
                </span>{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-clay-600 to-brown-700">
                  Cambodia
                </span>
              </h1>
              <div className="w-20 h-1 bg-gradient-to-r from-gold-400 to-clay-400 rounded-full" />
            </div>

            {/* Description */}
            <p className="text-lg text-brown-600 leading-relaxed max-w-lg">
              Discover handmade and modern accessories with Khmer charm, crafted for everyday beauty. Each piece carries the spirit of Cambodian artistry.
            </p>

            {/* Stats */}
            <div className="flex gap-8">
              {[
                { value: "500+", label: "Products" },
                { value: "2k+", label: "Happy Customers" },
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

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="group flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white font-semibold rounded-xl shadow-lg shadow-gold-200 hover:shadow-xl hover:shadow-gold-300 transition-all duration-300 hover:-translate-y-0.5">
                <ShoppingBag className="w-5 h-5" />
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center gap-2 px-8 py-3.5 bg-white border-2 border-gold-300 hover:border-gold-500 text-brown-700 hover:text-gold-700 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                <BookOpen className="w-5 h-5" />
                View Collections
              </button>
            </div>
          </div>

          {/* Image / Illustration */}
          <div className="relative flex items-center justify-center">
            {/* Decorative rings */}
            <div className="absolute w-80 h-80 rounded-full border-2 border-dashed border-gold-200/60 animate-spin" style={{ animationDuration: "30s" }} />
            <div className="absolute w-64 h-64 rounded-full border border-clay-200/40 animate-spin" style={{ animationDuration: "20s", animationDirection: "reverse" }} />

            {/* Main image box */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-3xl overflow-hidden shadow-2xl shadow-brown-200/50 border border-gold-200/50">
              <LotusIllustration />
            </div>

            {/* Floating badge - top left */}
            <div className="absolute top-4 -left-4 bg-white rounded-2xl shadow-lg shadow-brown-100 p-3 flex items-center gap-2.5 border border-gold-100">
              <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center text-sm">💛</div>
              <div>
                <div className="text-xs font-bold text-brown-800">New Arrivals</div>
                <div className="text-[10px] text-brown-500">12 items this week</div>
              </div>
            </div>

            {/* Floating badge - bottom right */}
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
