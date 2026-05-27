import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import ProductIllustration from "./ProductIllustration";

// Normalise data shape: backend uses snake_case, frontend uses camelCase
function normalise(p) {
  return {
    id:            p.id,
    name:          p.name,
    category:      p.category,
    priceUSD:      p.priceUSD ?? p.price_usd ?? p.price ?? 0,
    priceKHR:      p.priceKHR ?? p.price_khr ?? 0,
    rating:        p.rating ?? 0,
    reviewCount:   p.reviewCount ?? p.review_count ?? p.reviews ?? 0,
    tag:           p.tag ?? null,
    isSale:        p.isSale ?? p.tag === "Sale",
    isNew:         p.isNew ?? p.tag === "New",
    isBestSeller:  p.isBestSeller ?? p.tag === "Popular",
    originalPriceUSD: p.originalPriceUSD ?? p.originalPrice ?? null,
  };
}

export default function ProductCard({ product: raw, onQuickView }) {
  const product = normalise(raw);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  const toast = useToast();
  const [cartStatus, setCartStatus] = useState("idle");

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.info("Please login to add items to your cart");
      return;
    }
    setCartStatus("loading");
    try {
      await addToCart(product.id, 1);
      setCartStatus("added");
      toast.success(`${product.name} added to cart`);
      setTimeout(() => setCartStatus("idle"), 1500);
    } catch (err) {
      toast.error(err.message || "Could not add to cart");
      setCartStatus("idle");
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      name: product.name,
      category: product.category,
      priceUSD: product.priceUSD,
      priceKHR: product.priceKHR,
      tag: product.tag,
    });
    toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(raw);
  };

  const tagStyle =
    product.tag === "Sale"    ? "bg-clay-500 text-white" :
    product.tag === "New"     ? "bg-khmer-green-500 text-white" :
    product.tag === "Popular" ? "bg-gold-400 text-white" :
    "bg-brown-200 text-brown-700";

  const cartLabel = { idle: "Add to Cart", loading: "Adding…", added: "Added! ✓" }[cartStatus];
  const cartCls = cartStatus === "added"
    ? "bg-khmer-green-500 text-white border-khmer-green-500"
    : cartStatus === "loading"
    ? "bg-gold-100 text-gold-500 border-gold-200 cursor-wait"
    : "bg-gold-50 hover:bg-gold-500 text-gold-700 hover:text-white border-gold-200 hover:border-gold-500 hover:shadow-md hover:shadow-gold-200";

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-ivory-dark/60 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-ivory">
        <ProductIllustration product={product} />

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          aria-label="Wishlist"
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 ${
            wishlisted ? "bg-clay-500 text-white" : "bg-white/90 text-brown-400 hover:text-clay-500"
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? "fill-white" : ""}`} />
        </button>

        {/* Tag */}
        {product.tag && (
          <div className={`absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${tagStyle}`}>
            {product.tag}
          </div>
        )}

        {/* Quick View on hover */}
        {onQuickView && (
          <button
            onClick={handleQuickView}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-brown-900/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-brown-900"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gold-600">{product.category}</span>

        <h3 className="font-display font-semibold text-brown-900 leading-tight group-hover:text-gold-700 transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.round(product.rating) ? "fill-gold-400 text-gold-400" : "text-brown-200"}`} />
            ))}
          </div>
          {product.reviewCount > 0 && <span className="text-xs text-brown-500">({product.reviewCount})</span>}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="font-bold text-brown-900 text-lg">${product.priceUSD.toFixed(2)}</span>
          <span className="text-xs text-brown-400">{product.priceKHR.toLocaleString()}៛</span>
          {product.isSale && product.originalPriceUSD && (
            <span className="text-xs text-brown-400 line-through ml-auto">${product.originalPriceUSD.toFixed(2)}</span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={cartStatus === "loading"}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${cartCls}`}
        >
          <ShoppingCart className="w-4 h-4" />
          {cartLabel}
        </button>
      </div>
    </Link>
  );
}
