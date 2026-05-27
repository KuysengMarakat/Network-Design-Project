import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

function AngkorPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g opacity="0.06">
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={i} x1={i * 60 - 200} y1="0" x2={i * 60 + 200} y2="400" stroke="white" strokeWidth="1" />
        ))}
      </g>
      <g transform="translate(80, 200)" opacity="0.12">
        {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <ellipse key={angle} cx={Math.cos(rad) * 40} cy={Math.sin(rad) * 40} rx="8" ry="20" fill="white"
              transform={`rotate(${angle} ${Math.cos(rad) * 40} ${Math.sin(rad) * 40})`} />
          );
        })}
        <circle cx="0" cy="0" r="12" fill="white" />
      </g>
      <g transform="translate(720, 200)" opacity="0.08">
        {[0,45,90,135,180,225,270,315].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <ellipse key={angle} cx={Math.cos(rad) * 35} cy={Math.sin(rad) * 35} rx="6" ry="18" fill="white"
              transform={`rotate(${angle} ${Math.cos(rad) * 35} ${Math.sin(rad) * 35})`} />
          );
        })}
        <circle cx="0" cy="0" r="10" fill="white" />
      </g>
      <g opacity="0.15">
        <path d="M0,30 Q50,10 100,30 Q150,50 200,30 Q250,10 300,30 Q350,50 400,30 Q450,10 500,30 Q550,50 600,30 Q650,10 700,30 Q750,50 800,30" stroke="white" strokeWidth="1.5" fill="none" />
        <path d="M0,370 Q50,350 100,370 Q150,390 200,370 Q250,350 300,370 Q350,390 400,370 Q450,350 500,370 Q550,390 600,370 Q650,350 700,370 Q750,390 800,370" stroke="white" strokeWidth="1.5" fill="none" />
      </g>
      <g opacity="0.12" fill="none" stroke="white" strokeWidth="1.5">
        <path d="M20,20 L60,20 L60,24 M20,20 L20,60 L24,60" />
        <circle cx="40" cy="40" r="15" />
        <path d="M780,20 L740,20 L740,24 M780,20 L780,60 L776,60" />
        <circle cx="760" cy="40" r="15" />
      </g>
    </svg>
  );
}

export default function CollectionBanner() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8" id="collections-banner">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brown-700 via-brown-800 to-brown-900 min-h-72 flex items-center shadow-2xl shadow-brown-900/30">
          <AngkorPattern />
          <div className="absolute inset-0 bg-gradient-to-r from-brown-900/60 via-transparent to-brown-900/40" />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 via-clay-400 to-gold-600 opacity-80" />

          <div className="relative z-10 w-full px-8 sm:px-12 lg:px-16 py-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-400/20 border border-gold-400/30 rounded-full text-gold-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-sm">
                <Sparkles className="w-3 h-3" />
                New Collection 2025
              </div>

              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                New Khmer Silk{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">Collection</span>
              </h2>

              <div className="flex items-center gap-3">
                <div className="h-px w-12 bg-gold-400/60" />
                <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                <div className="h-px w-6 bg-gold-400/40" />
              </div>

              <p className="text-ivory/80 text-base leading-relaxed">
                Soft colors, traditional inspiration, and modern design made for your daily style. Each piece honors the beauty of Cambodian silk tradition.
              </p>

              <div className="flex flex-wrap gap-4 pt-1">
                {["Silk-inspired textures", "Limited edition", "Hand-finished"].map((feat) => (
                  <div key={feat} className="flex items-center gap-1.5 text-gold-300/80 text-sm">
                    <div className="w-1 h-1 rounded-full bg-gold-400" />
                    {feat}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-center gap-4">
              <Link to="/collections" className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-brown-900 font-bold rounded-2xl shadow-xl shadow-gold-900/30 hover:shadow-gold-900/50 transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap">
                Explore Collection
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="text-ivory/60 text-sm text-center lg:text-center">
                <span className="text-gold-300 font-bold">24</span> pieces available
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
