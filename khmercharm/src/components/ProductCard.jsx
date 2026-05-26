import { useState } from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";

// Product image illustration using SVG
function ProductIllustration({ product }) {
  const icons = {
    "Golden Lotus Bracelet": { emoji: "💛", desc: "Gold Bracelet", accent: "#d4a017" },
    "Angkor Pearl Necklace": { emoji: "📿", desc: "Pearl Necklace", accent: "#226638" },
    "Silk Charm Hair Clip": { emoji: "🌸", desc: "Hair Clip", accent: "#bf3a1e" },
    "Handmade Woven Bag": { emoji: "👜", desc: "Woven Bag", accent: "#8f5d2c" },
    "Khmer Pattern Ring": { emoji: "💍", desc: "Silver Ring", accent: "#3a8551" },
    "Mini Lotus Phone Charm": { emoji: "🌺", desc: "Phone Charm", accent: "#bf3a1e" },
    "Royal Gold Earrings": { emoji: "✨", desc: "Earrings", accent: "#d4a017" },
    "Clay Stone Keychain": { emoji: "🗝️", desc: "Keychain", accent: "#6e4318" },
  };
  const info = icons[product.name] || { emoji: "💎", desc: "Accessory", accent: "#d4a017" };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 relative">
      {/* Background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-60`}
        style={{ background: `linear-gradient(135deg, ${info.accent}15 0%, #faf7f0 50%, ${info.accent}08 100%)` }}
      />
      {/* Silk texture */}
      <div className="absolute inset-0 opacity-20"
        style={{backgroundImage: "repeating-linear-gradient(45deg,transparent,transparent 3px,rgba(212,160,23,0.04) 3px,rgba(212,160,23,0.04) 6px)"}}
      />
      {/* Decorative circle */}
      <div
        className="absolute w-28 h-28 rounded-full opacity-10"
        style={{ background: `radial-gradient(circle, ${info.accent} 0%, transparent 70%)` }}
      />
      {/* Emoji */}
      <div className="relative text-5xl z-10 drop-shadow-sm">{info.emoji}</div>
      <div className="relative z-10 text-xs font-medium px-3 py-1 rounded-full bg-white/70 text-brown-600 backdrop-blur-sm border border-white/80">
        {info.desc}
      </div>
      {/* Corner sparkle */}
      <div className="absolute top-3 right-3 opacity-40">
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d="M8,0 L9,7 L16,8 L9,9 L8,16 L7,9 L0,8 L7,7 Z" fill={info.accent} />
        </svg>
      </div>
    </div>
  );
}

export default function ProductCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-ivory-dark/60 flex flex-col">
      {/* Product image area */}
      <div className="relative h-52 overflow-hidden bg-ivory">
        <ProductIllustration product={product} />

        {/* Wishlist button */}
        <button
          onClick={() => setWishlisted(!wishlisted)}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 ${
            wishlisted
              ? "bg-clay-500 text-white"
              : "bg-white/90 text-brown-400 hover:text-clay-500"
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? "fill-white" : ""}`} />
        </button>

        {/* Tag badge */}
        {product.tag && (
          <div className={`absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full text-xs font-semibold ${product.tagColor}`}>
            {product.tag}
          </div>
        )}

        {/* Sale overlay */}
        {product.onSale && (
          <div className="absolute bottom-3 left-3 z-10 px-2 py-0.5 bg-clay-500 text-white text-xs font-bold rounded-md">
            SALE
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-brown-900/0 group-hover:bg-brown-900/5 transition-colors duration-300" />
      </div>

      {/* Product info */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Category */}
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gold-600">
          {product.category}
        </span>

        {/* Name */}
        <h3 className="font-display font-semibold text-brown-900 leading-tight group-hover:text-gold-700 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < product.rating
                    ? "fill-gold-400 text-gold-400"
                    : "text-brown-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-brown-500">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="font-bold text-brown-900 text-lg">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-xs text-brown-400">
            {product.priceKHR.toLocaleString()}៛
          </span>
          {product.onSale && product.originalPrice && (
            <span className="text-xs text-brown-400 line-through ml-auto">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            addedToCart
              ? "bg-khmer-green-500 text-white scale-95"
              : "bg-gold-50 hover:bg-gold-500 text-gold-700 hover:text-white border border-gold-200 hover:border-gold-500 hover:shadow-md hover:shadow-gold-200"
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {addedToCart ? "Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
