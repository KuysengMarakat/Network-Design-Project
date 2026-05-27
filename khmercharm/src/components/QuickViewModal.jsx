import { Link } from "react-router-dom";
import { X, Star, ShoppingCart, Heart, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import ProductIllustration from "./ProductIllustration";

export default function QuickViewModal({ product, onClose }) {
  const { addToCart }    = useCart();
  const { user }         = useAuth();
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  const toast            = useToast();
  const [qty, setQty]    = useState(1);
  const [adding, setAdding] = useState(false);

  if (!product) return null;

  const priceUSD = product.priceUSD ?? product.price_usd ?? 0;
  const priceKHR = product.priceKHR ?? product.price_khr ?? 0;
  const rating   = product.rating ?? 0;
  const wishlisted = isWishlisted(product.id);

  const handleAdd = async () => {
    if (!user) { toast.info("Please login to add items to your cart"); return; }
    setAdding(true);
    try {
      await addToCart(product.id, qty);
      toast.success(`Added ${qty} × ${product.name}`);
      onClose();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brown-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-ivory rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="h-1 bg-gradient-to-r from-clay-400 via-gold-400 to-khmer-green-500" />
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-md text-brown-500 hover:text-brown-800 transition-colors">
          <X className="w-4 h-4" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="h-72 md:h-full bg-ivory-dark relative">
            <ProductIllustration product={product} size="lg" showLabel={false} />
          </div>
          {/* Info */}
          <div className="p-6 md:p-8 space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold-600">{product.category}</span>
            <h2 className="font-display text-2xl font-bold text-brown-900">{product.name}</h2>

            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(rating) ? "fill-gold-400 text-gold-400" : "text-brown-200"}`} />
                ))}
              </div>
              <span className="text-xs text-brown-500">({product.reviewCount ?? product.review_count ?? 0} reviews)</span>
            </div>

            <p className="text-sm text-brown-600 leading-relaxed">
              {product.description ?? "A beautifully crafted piece inspired by traditional Khmer art and modern elegance."}
            </p>

            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-brown-900">${priceUSD.toFixed(2)}</span>
              <span className="text-sm text-brown-400">{priceKHR.toLocaleString()}៛</span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-brown-700">Qty</span>
              <div className="flex items-center border border-gold-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-1.5 hover:bg-gold-50 text-brown-600 font-bold">−</button>
                <span className="px-4 py-1.5 font-semibold text-brown-900 min-w-[40px] text-center">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="px-3 py-1.5 hover:bg-gold-50 text-brown-600 font-bold">+</button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleAdd}
                disabled={adding}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 disabled:opacity-60 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                {adding ? "Adding…" : "Add to Cart"}
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => { toggleWishlist({ id: product.id, name: product.name, category: product.category, priceUSD, priceKHR }); toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist"); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${wishlisted ? "bg-clay-500 text-white border-clay-500" : "border-clay-200 text-clay-600 hover:bg-clay-50"}`}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? "fill-white" : ""}`} /> {wishlisted ? "Saved" : "Save"}
                </button>
                <Link
                  to={`/product/${product.id}`}
                  onClick={onClose}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border border-gold-300 text-gold-700 hover:bg-gold-50 transition-colors"
                >
                  Full Details <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
