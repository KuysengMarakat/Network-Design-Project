// Reusable SVG-style illustration for product images.
// Provides a consistent decorative look without external image files.
const ICONS = {
  "Golden Lotus Bracelet":  { emoji: "💛", desc: "Gold Bracelet",  accent: "#d4a017" },
  "Angkor Pearl Necklace":  { emoji: "📿", desc: "Pearl Necklace", accent: "#226638" },
  "Silk Charm Hair Clip":   { emoji: "🌸", desc: "Hair Clip",      accent: "#bf3a1e" },
  "Handmade Woven Bag":     { emoji: "👜", desc: "Woven Bag",      accent: "#8f5d2c" },
  "Khmer Pattern Ring":     { emoji: "💍", desc: "Silver Ring",    accent: "#3a8551" },
  "Mini Lotus Phone Charm": { emoji: "🌺", desc: "Phone Charm",    accent: "#bf3a1e" },
  "Royal Gold Earrings":    { emoji: "✨", desc: "Earrings",       accent: "#d4a017" },
  "Apsara Gold Earrings":   { emoji: "✨", desc: "Earrings",       accent: "#d4a017" },
  "Clay Stone Keychain":    { emoji: "🗝️", desc: "Keychain",       accent: "#6e4318" },
};

export default function ProductIllustration({ product, size = "default", showLabel = true }) {
  const info = ICONS[product?.name] || { emoji: "💎", desc: "Accessory", accent: "#d4a017" };
  const emojiSize = size === "lg" ? "text-7xl" : size === "sm" ? "text-3xl" : "text-5xl";

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 relative">
      <div
        className="absolute inset-0 opacity-60"
        style={{ background: `linear-gradient(135deg, ${info.accent}15 0%, #faf7f0 50%, ${info.accent}08 100%)` }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: "repeating-linear-gradient(45deg,transparent,transparent 3px,rgba(212,160,23,0.04) 3px,rgba(212,160,23,0.04) 6px)" }}
      />
      <div
        className="absolute w-3/5 h-3/5 rounded-full opacity-10"
        style={{ background: `radial-gradient(circle, ${info.accent} 0%, transparent 70%)` }}
      />
      <div className={`relative ${emojiSize} z-10 drop-shadow-sm`}>{info.emoji}</div>
      {showLabel && (
        <div className="relative z-10 text-xs font-medium px-3 py-1 rounded-full bg-white/70 text-brown-600 backdrop-blur-sm border border-white/80">
          {info.desc}
        </div>
      )}
      <div className="absolute top-3 right-3 opacity-40">
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d="M8,0 L9,7 L16,8 L9,9 L8,16 L7,9 L0,8 L7,7 Z" fill={info.accent} />
        </svg>
      </div>
    </div>
  );
}
