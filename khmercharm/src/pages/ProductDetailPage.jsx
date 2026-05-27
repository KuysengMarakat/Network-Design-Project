import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, Heart, ShoppingCart, ChevronDown, Truck, Shield, Award, RefreshCw, Plus, Minus } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import ProductCard from "../components/ProductCard";
import ProductIllustration from "../components/ProductIllustration";
import EmptyState from "../components/ui/EmptyState";
import { LineSkeleton } from "../components/ui/LoadingSkeleton";
import { productsAPI } from "../api/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";

const STYLES = ["Default", "Gold finish", "Silver finish", "Rose gold"];

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  const toast = useToast();

  const [product,  setProduct]  = useState(null);
  const [related,  setRelated]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [qty,      setQty]      = useState(1);
  const [style,    setStyle]    = useState(STYLES[0]);
  const [openSection, setOpenSection] = useState("description");
  const [adding,   setAdding]   = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    productsAPI.getOne(id)
      .then((res) => {
        setProduct(res.data.product);
        // Fetch related (same category, exclude self)
        return productsAPI.getAll({ category: res.data.product.category });
      })
      .then((res) => {
        setRelated((res.data.products || []).filter((p) => String(p.id) !== String(id)).slice(0, 4));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <ProductLoadingPage />;
  if (error || !product) {
    return (
      <>
        <PageHeader title="Product not found" breadcrumbs={[{ label: "Shop", to: "/shop" }, { label: "Not found" }]} />
        <section className="py-16 bg-ivory">
          <EmptyState icon="🔎" title="Product not found" description="Maybe it's been moved or removed."
            action={<Link to="/shop" className="px-5 py-2.5 bg-gold-500 hover:bg-gold-400 text-white rounded-xl font-semibold">Back to Shop</Link>} />
        </section>
      </>
    );
  }

  const priceUSD = product.price_usd ?? product.priceUSD ?? 0;
  const priceKHR = product.price_khr ?? product.priceKHR ?? 0;
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = async () => {
    if (!user) { toast.info("Please login to add items to your cart"); return; }
    setAdding(true);
    try {
      await addToCart(product.id, qty);
      toast.success(`Added ${qty} × ${product.name} to cart`);
    } catch (e) { toast.error(e.message); }
    finally { setAdding(false); }
  };

  const handleWishlist = () => {
    toggleWishlist({ id: product.id, name: product.name, category: product.category, priceUSD, priceKHR });
    toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const accordion = [
    { id: "description", title: "Description",
      content: product.description || "A beautifully crafted piece inspired by traditional Khmer art and modern elegance. Hand-finished in Cambodia by skilled local artisans." },
    { id: "materials",   title: "Materials",
      content: "Premium materials sourced from Cambodian and regional suppliers. Most pieces use 18k gold-plated brass, sterling silver, freshwater pearls, or ethically sourced silk." },
    { id: "delivery",    title: "Delivery",
      content: "Same-day delivery in Phnom Penh on orders before 2 PM. Nationwide shipping within 1–3 business days. FREE delivery on orders over $25." },
    { id: "care",        title: "Care Guide",
      content: "Avoid contact with water, perfume, and lotion to keep the finish bright. Store in a soft pouch or jewellery box. Polish gently with a soft cloth when needed." },
  ];

  return (
    <>
      <PageHeader
        title={product.name}
        breadcrumbs={[
          { label: "Shop", to: "/shop" },
          { label: product.category, to: `/shop?category=${encodeURIComponent(product.category)}` },
          { label: product.name },
        ]}
      />

      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-ivory">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">

          {/* Left: gallery */}
          <div className="space-y-3">
            <div className="aspect-square rounded-3xl bg-ivory-dark border border-gold-100 overflow-hidden shadow-md">
              <ProductIllustration product={product} size="lg" showLabel={false} />
            </div>
            {/* Thumbnails (decorative) */}
            <div className="grid grid-cols-4 gap-2">
              {[1,2,3,4].map((i) => (
                <button key={i} className={`aspect-square rounded-xl bg-ivory-dark border-2 overflow-hidden ${i === 1 ? "border-gold-400" : "border-transparent hover:border-gold-200"} transition-colors`}>
                  <ProductIllustration product={product} size="sm" showLabel={false} />
                </button>
              ))}
            </div>
          </div>

          {/* Right: info */}
          <div className="space-y-5">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-gold-600">{product.category}</span>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-brown-900">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating || 0) ? "fill-gold-400 text-gold-400" : "text-brown-200"}`} />
                  ))}
                </div>
                <span className="text-sm text-brown-500">({product.review_count ?? product.reviewCount ?? 0} reviews)</span>
                {product.tag && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    product.tag === "Sale" ? "bg-clay-100 text-clay-700" :
                    product.tag === "New" ? "bg-khmer-green-100 text-khmer-green-700" :
                    "bg-gold-100 text-gold-700"
                  }`}>
                    {product.tag}
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl font-bold text-brown-900">${priceUSD.toFixed(2)}</span>
              <span className="text-sm text-brown-400">{priceKHR.toLocaleString()}៛</span>
            </div>

            <p className="text-brown-600 leading-relaxed">{product.description}</p>

            {/* Style selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-brown-700 uppercase tracking-wider">Style</label>
              <div className="flex flex-wrap gap-2">
                {STYLES.map((s) => (
                  <button key={s} onClick={() => setStyle(s)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                      style === s ? "bg-brown-800 text-white border-brown-800" : "bg-white text-brown-600 border-gold-200 hover:border-gold-400"
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 text-sm">
              {product.stock > 0 ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-khmer-green-500" />
                  <span className="text-khmer-green-700 font-semibold">In Stock</span>
                  {product.stock < 10 && <span className="text-clay-600 text-xs">Only {product.stock} left!</span>}
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-clay-500" />
                  <span className="text-clay-700 font-semibold">Out of Stock</span>
                </>
              )}
            </div>

            {/* Quantity + buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="flex items-center border border-gold-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-3 hover:bg-gold-50 text-brown-600">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-3 font-bold text-brown-900 min-w-[48px] text-center">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="px-3 py-3 hover:bg-gold-50 text-brown-600">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button onClick={handleAddToCart} disabled={adding || product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 disabled:opacity-60 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all">
                <ShoppingCart className="w-4 h-4" /> {adding ? "Adding…" : "Add to Cart"}
              </button>
              <button onClick={handleWishlist}
                className={`p-3 border-2 rounded-xl transition-colors ${wishlisted ? "bg-clay-500 border-clay-500 text-white" : "border-clay-200 text-clay-600 hover:bg-clay-50"}`}>
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-white" : ""}`} />
              </button>
            </div>

            {/* Delivery info badges */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {[
                { Icon: Truck,  label: "Free over $25" },
                { Icon: RefreshCw, label: "30-day returns" },
                { Icon: Award,  label: "Handmade in Cambodia" },
                { Icon: Shield, label: "Secure checkout" },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 bg-ivory-dark rounded-xl text-xs text-brown-600">
                  <b.Icon className="w-4 h-4 text-gold-600 flex-shrink-0" />
                  <span className="font-semibold">{b.label}</span>
                </div>
              ))}
            </div>

            {/* Accordion */}
            <div className="space-y-2 pt-4 border-t border-gold-100">
              {accordion.map((s) => (
                <div key={s.id} className="border-b border-gold-100">
                  <button onClick={() => setOpenSection(openSection === s.id ? null : s.id)} className="w-full flex items-center justify-between py-3 text-left">
                    <span className="font-semibold text-brown-900">{s.title}</span>
                    <ChevronDown className={`w-4 h-4 text-brown-400 transition-transform ${openSection === s.id ? "rotate-180" : ""}`} />
                  </button>
                  {openSection === s.id && (
                    <p className="pb-3 text-sm text-brown-600 leading-relaxed">{s.content}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-ivory-dark silk-texture">
          <div className="max-w-7xl mx-auto space-y-6">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-brown-900">You may also like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function ProductLoadingPage() {
  return (
    <>
      <PageHeader title="Loading product…" breadcrumbs={[{ label: "Shop", to: "/shop" }]} />
      <section className="py-10 px-4 bg-ivory">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">
          <div className="aspect-square rounded-3xl bg-ivory-dark animate-pulse" />
          <div className="space-y-4">
            <LineSkeleton width="60%" height="1rem" />
            <LineSkeleton width="80%" height="2rem" />
            <LineSkeleton width="40%" height="1.5rem" />
            <LineSkeleton width="100%" height="4rem" />
            <LineSkeleton width="100%" height="3rem" />
          </div>
        </div>
      </section>
    </>
  );
}
