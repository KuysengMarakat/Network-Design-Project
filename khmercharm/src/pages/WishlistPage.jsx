import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import ProductIllustration from "../components/ProductIllustration";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function WishlistPage() {
  const { items, remove, clear } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();

  const handleMoveToCart = async (item) => {
    if (!user) { toast.info("Please login to add to cart"); return; }
    try {
      await addToCart(item.id, 1);
      remove(item.id);
      toast.success(`${item.name} moved to cart`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <PageHeader
        title="My Wishlist"
        subtitle={items.length === 0 ? "Save items you love for later" : `${items.length} saved item${items.length !== 1 ? "s" : ""}`}
        breadcrumbs={[{ label: "Wishlist" }]}
      >
        {items.length > 0 && (
          <button onClick={clear} className="text-xs font-semibold text-clay-500 hover:text-clay-600 flex items-center gap-1.5">
            <Trash2 className="w-3.5 h-3.5" /> Clear all
          </button>
        )}
      </PageHeader>

      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-ivory min-h-[60vh]">
        <div className="max-w-6xl mx-auto">
          {items.length === 0 ? (
            <EmptyState
              icon="💝"
              title="Your wishlist is empty"
              description="Tap the heart icon on any product to save it for later."
              action={
                <Link to="/shop" className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all inline-flex items-center gap-2">
                  Discover Products <ArrowRight className="w-4 h-4" />
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gold-100 group">
                  <Link to={`/product/${item.id}`} className="block">
                    <div className="h-44 bg-ivory-dark relative">
                      <ProductIllustration product={item} />
                      <button
                        onClick={(e) => { e.preventDefault(); remove(item.id); toast.success("Removed from wishlist"); }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-clay-500 hover:bg-clay-600 text-white flex items-center justify-center shadow-md transition-colors"
                        aria-label="Remove"
                      >
                        <Heart className="w-4 h-4 fill-white" />
                      </button>
                    </div>
                  </Link>
                  <div className="p-4 space-y-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gold-600">{item.category}</span>
                    <Link to={`/product/${item.id}`} className="block">
                      <h3 className="font-display font-semibold text-brown-900 hover:text-gold-700 transition-colors line-clamp-2">{item.name}</h3>
                    </Link>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-brown-900 text-lg">${item.priceUSD.toFixed(2)}</span>
                      <span className="text-xs text-brown-400">{item.priceKHR.toLocaleString()}៛</span>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" /> Move to Cart
                      </button>
                      <button
                        onClick={() => { remove(item.id); toast.success("Removed"); }}
                        className="px-3 py-2 border border-clay-200 text-clay-600 hover:bg-clay-50 text-xs font-semibold rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
