import { useState, useEffect } from "react";
import { AuthProvider }  from "./context/AuthContext";
import { CartProvider }  from "./context/CartContext";
import Navbar            from "./components/Navbar";
import Hero              from "./components/Hero";
import CategoryCard      from "./components/CategoryCard";
import ProductCard       from "./components/ProductCard";
import CollectionBanner  from "./components/CollectionBanner";
import Benefits          from "./components/Benefits";
import Reviews           from "./components/Reviews";
import Newsletter        from "./components/Newsletter";
import Footer            from "./components/Footer";
import LoginModal        from "./components/LoginModal";
import CartDrawer        from "./components/CartDrawer";
import { productsAPI }   from "./api/api";
import { categories, reviews, benefits } from "./data/sampleData";

const FILTERS = ["All", "New Arrival", "Best Seller", "Sale"];

const TAG_MAP = {
  "All":         {},
  "New Arrival": { tag: "New" },
  "Best Seller": { tag: "Popular" },
  "Sale":        { tag: "Sale" },
};

// Skeleton card for loading state
function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-ivory-dark/60 animate-pulse">
      <div className="h-52 bg-ivory-dark" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 bg-ivory-dark rounded-full" />
        <div className="h-4 w-3/4 bg-ivory-dark rounded-full" />
        <div className="h-3 w-24 bg-ivory-dark rounded-full" />
        <div className="h-8 bg-ivory-dark rounded-xl mt-2" />
      </div>
    </div>
  );
}

function AppContent() {
  const [activeFilter,   setActiveFilter]   = useState("All");
  const [products,       setProducts]       = useState([]);
  const [loadingProducts,setLoadingProducts] = useState(true);
  const [productError,   setProductError]   = useState("");
  const [showLogin,      setShowLogin]      = useState(false);
  const [showCart,       setShowCart]       = useState(false);

  // ── Fetch products from backend ──────────────────────────
  useEffect(() => {
    setLoadingProducts(true);
    setProductError("");
    const params = TAG_MAP[activeFilter] || {};
    productsAPI.getAll(params)
      .then((res) => setProducts(res.data.products || []))
      .catch(() => {
        setProductError("Could not load products. Is the backend running on http://localhost:5000?");
        setProducts([]);
      })
      .finally(() => setLoadingProducts(false));
  }, [activeFilter]);

  // Count per filter tab (use cached data from "All" load)
  const [allProducts, setAllProducts] = useState([]);
  useEffect(() => {
    productsAPI.getAll({}).then((res) => setAllProducts(res.data.products || [])).catch(() => {});
  }, []);

  const countFor = (filter) => {
    if (filter === "All") return allProducts.length;
    const tag = TAG_MAP[filter]?.tag;
    return allProducts.filter((p) => p.tag === tag).length;
  };

  return (
    <div className="min-h-screen bg-ivory font-body">
      <Navbar onLoginClick={() => setShowLogin(true)} onCartClick={() => setShowCart(true)} />

      {/* Modals */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <CartDrawer isOpen={showCart} onClose={() => setShowCart(false)} onLoginRequired={() => setShowLogin(true)} />

      {/* ── Hero ── */}
      <Hero />

      {/* ── Categories ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-ivory-dark silk-texture" id="shop">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-gold-600 text-sm font-semibold uppercase tracking-widest">Browse by Category</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-brown-900">Shop Our Collections</h2>
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-400" />
              <div className="w-2 h-2 rounded-full bg-gold-400" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-ivory lotus-pattern" id="collections">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-gold-600 text-sm font-semibold uppercase tracking-widest">Handpicked for you</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-brown-900">Featured Products</h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-brown-400 bg-white px-3 py-1.5 rounded-full border border-gold-100">
              <span className="w-2 h-2 rounded-full bg-khmer-green-400 animate-pulse" />
              Live from backend API
            </div>
          </div>

          {/* Filter bar */}
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <button key={filter} onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === filter
                    ? "bg-gold-500 text-white shadow-md shadow-gold-200"
                    : "bg-white border border-gold-200 text-brown-600 hover:border-gold-400 hover:text-gold-700 hover:bg-gold-50"
                }`}>
                {filter}
                {filter !== "All" && !loadingProducts && (
                  <span className={`ml-1.5 text-xs ${activeFilter === filter ? "text-white/70" : "text-brown-400"}`}>
                    ({countFor(filter)})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Error banner */}
          {productError && (
            <div className="p-4 bg-clay-50 border border-clay-200 rounded-2xl text-sm text-clay-700 flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold">Backend not connected</p>
                <p className="text-xs mt-0.5">{productError}</p>
              </div>
            </div>
          )}

          {/* Product grid */}
          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onLoginRequired={() => setShowLogin(true)} />
              ))}
            </div>
          ) : !productError ? (
            <div className="text-center py-20 text-brown-400">
              <div className="text-4xl mb-3">🌸</div>
              <p className="font-display text-lg">No products found</p>
              <button onClick={() => setActiveFilter("All")}
                className="mt-4 px-5 py-2 bg-gold-100 hover:bg-gold-200 text-gold-700 rounded-full text-sm font-medium transition-colors">
                View All Products
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <CollectionBanner />
      <Benefits benefits={benefits} />
      <Reviews reviews={reviews} />
      <Newsletter />
      <Footer />
    </div>
  );
}

// Wrap everything in providers
export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
