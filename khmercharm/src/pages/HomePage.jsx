import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Hero               from "../components/Hero";
import CategoryCard       from "../components/CategoryCard";
import ProductCard        from "../components/ProductCard";
import CollectionBanner   from "../components/CollectionBanner";
import Benefits           from "../components/Benefits";
import Reviews            from "../components/Reviews";
import Newsletter         from "../components/Newsletter";
import Gallery            from "../components/Gallery";
import QuickViewModal     from "../components/QuickViewModal";
import FilterBar          from "../components/FilterBar";
import { ProductGridSkeleton } from "../components/ui/LoadingSkeleton";
import EmptyState         from "../components/ui/EmptyState";
import { productsAPI }    from "../api/api";
import { categories, reviews, benefits, products as fallbackProducts } from "../data/sampleData";
import { ArrowRight } from "lucide-react";

const FILTERS = ["All", "New Arrival", "Best Seller", "Sale"];
const TAG_MAP = {
  "All":         {},
  "New Arrival": { tag: "New" },
  "Best Seller": { tag: "Popular" },
  "Sale":        { tag: "Sale" },
};

export default function HomePage() {
  const [activeFilter, setActiveFilter]     = useState("All");
  const [products, setProducts]             = useState([]);
  const [allProducts, setAllProducts]       = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState("");
  const [quickView, setQuickView]           = useState(null);

  useEffect(() => {
    setLoading(true);
    const params = TAG_MAP[activeFilter] || {};
    productsAPI.getAll(params)
      .then((res) => { setProducts(res.data.products || []); setError(""); })
      .catch(() => { setProducts(fallbackProducts); setError("offline"); })
      .finally(() => setLoading(false));
  }, [activeFilter]);

  useEffect(() => {
    productsAPI.getAll({})
      .then((res) => setAllProducts(res.data.products || []))
      .catch(() => setAllProducts(fallbackProducts));
  }, []);

  const counts = {
    "New Arrival": allProducts.filter((p) => p.tag === "New").length,
    "Best Seller": allProducts.filter((p) => p.tag === "Popular").length,
    "Sale":        allProducts.filter((p) => p.tag === "Sale").length,
  };

  return (
    <>
      <Hero />

      {/* Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-ivory-dark silk-texture" id="shop-categories">
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
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {categories.map((cat) => <CategoryCard key={cat.id} category={cat} />)}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-ivory lotus-pattern">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-gold-600 text-sm font-semibold uppercase tracking-widest">Handpicked for you</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-brown-900">Featured Products</h2>
            </div>
            <Link to="/shop" className="flex items-center gap-1.5 text-sm font-semibold text-gold-700 hover:text-gold-600 transition-colors group">
              View all products
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <FilterBar filters={FILTERS} active={activeFilter} onChange={setActiveFilter} counts={counts} />

          {error === "offline" && (
            <div className="p-3 bg-gold-50 border border-gold-200 rounded-xl text-xs text-gold-700 flex items-center gap-2">
              ⚡ Showing cached products — backend offline.
            </div>
          )}

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((p) => (
                <ProductCard key={p.id} product={p} onQuickView={setQuickView} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No products found"
              description="Try a different filter or check back soon."
              action={
                <button onClick={() => setActiveFilter("All")} className="px-5 py-2 bg-gold-100 hover:bg-gold-200 text-gold-700 rounded-full text-sm font-semibold transition-colors">
                  View All Products
                </button>
              }
            />
          )}
        </div>
      </section>

      <CollectionBanner />
      <Benefits benefits={benefits} />

      {/* About preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-ivory" id="about-preview">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-gold-600 text-sm font-semibold uppercase tracking-widest">Our Story</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-brown-900">Made with Khmer Charm</h2>
            <p className="text-brown-600 leading-relaxed">
              KhmerCharm Accessories is inspired by Cambodian art, culture, and everyday elegance. We combine modern fashion with local beauty to create meaningful accessories for every occasion.
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gold-400 text-gold-700 hover:bg-gold-400 hover:text-white font-semibold rounded-xl transition-all">
              Learn More <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative h-72 rounded-3xl bg-gradient-to-br from-gold-50 via-clay-50 to-khmer-green-50 border border-gold-100 overflow-hidden flex items-center justify-center">
            <div className="text-7xl">🪷</div>
            <div className="absolute top-4 right-4 px-3 py-1 bg-white rounded-full shadow-sm border border-gold-100 text-xs font-semibold text-gold-700">
              Since 2024
            </div>
          </div>
        </div>
      </section>

      <Reviews reviews={reviews} />
      <Gallery />
      <Newsletter />

      {quickView && <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />}
    </>
  );
}
