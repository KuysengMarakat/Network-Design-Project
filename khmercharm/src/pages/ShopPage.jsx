import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import PageHeader  from "../components/ui/PageHeader";
import ProductCard from "../components/ProductCard";
import FilterBar   from "../components/FilterBar";
import EmptyState  from "../components/ui/EmptyState";
import QuickViewModal from "../components/QuickViewModal";
import { ProductGridSkeleton } from "../components/ui/LoadingSkeleton";
import { productsAPI } from "../api/api";
import { categories, products as fallbackProducts } from "../data/sampleData";

const TAG_FILTERS = ["All", "New Arrival", "Best Seller", "Sale"];
const TAG_MAP = {
  "All": null, "New Arrival": "New", "Best Seller": "Popular", "Sale": "Sale",
};

const SORT_OPTIONS = [
  { value: "newest",    label: "Newest" },
  { value: "best",      label: "Best Seller" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc",label: "Price: High to Low" },
  { value: "rating",    label: "Highest Rated" },
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialSearch   = searchParams.get("search")   || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [search, setSearch]     = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [tag, setTag]           = useState("All");
  const [sort, setSort]         = useState("newest");
  const [maxPrice, setMaxPrice] = useState(50);
  const [filterOpen, setFilterOpen] = useState(false);
  const [quickView, setQuickView] = useState(null);

  // Fetch on category/tag/search change (server filters)
  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category !== "All") params.category = category;
    if (search)              params.search   = search;
    if (TAG_MAP[tag])        params.tag      = TAG_MAP[tag];

    productsAPI.getAll(params)
      .then((res) => { setProducts(res.data.products || []); setError(""); })
      .catch(() => { setProducts(fallbackProducts); setError("offline"); })
      .finally(() => setLoading(false));
  }, [category, search, tag]);

  // Sync URL with category/search
  useEffect(() => {
    const params = {};
    if (category !== "All") params.category = category;
    if (search)              params.search   = search;
    setSearchParams(params, { replace: true });
  }, [category, search, setSearchParams]);

  // Client-side: price filter + sort
  const displayed = useMemo(() => {
    let list = [...products].filter((p) => {
      const price = p.priceUSD ?? p.price_usd ?? 0;
      return price <= maxPrice;
    });

    switch (sort) {
      case "price_asc":  list.sort((a, b) => (a.priceUSD ?? a.price_usd) - (b.priceUSD ?? b.price_usd)); break;
      case "price_desc": list.sort((a, b) => (b.priceUSD ?? b.price_usd) - (a.priceUSD ?? a.price_usd)); break;
      case "rating":     list.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      case "best":       list.sort((a, b) => ((b.reviewCount ?? b.review_count ?? 0) - (a.reviewCount ?? a.review_count ?? 0))); break;
      default:           list.sort((a, b) => b.id - a.id); // newest first
    }
    return list;
  }, [products, sort, maxPrice]);

  const tagCounts = {
    "New Arrival": products.filter((p) => p.tag === "New").length,
    "Best Seller": products.filter((p) => p.tag === "Popular").length,
    "Sale":        products.filter((p) => p.tag === "Sale").length,
  };

  const clearAll = () => { setSearch(""); setCategory("All"); setTag("All"); setSort("newest"); setMaxPrice(50); };

  return (
    <>
      <PageHeader
        title="Shop Accessories"
        subtitle="Discover handcrafted Cambodian-inspired pieces — from delicate everyday charms to statement gifts."
        breadcrumbs={[{ label: "Shop" }]}
      >
        <div className="flex items-center gap-2 text-xs text-brown-500">
          <span className="font-semibold text-brown-700">{displayed.length}</span> products
        </div>
      </PageHeader>

      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-ivory">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[260px_1fr] gap-6">

            {/* Sidebar Filters (desktop) */}
            <aside className="hidden lg:block space-y-5 self-start sticky top-20">
              <FilterSidebar
                category={category} setCategory={setCategory}
                maxPrice={maxPrice} setMaxPrice={setMaxPrice}
                clearAll={clearAll}
              />
            </aside>

            {/* Main */}
            <div className="space-y-5 min-w-0">
              {/* Search + sort + tag filter */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex items-center gap-2 bg-white border border-gold-200 focus-within:border-gold-400 rounded-xl px-4 py-2.5 transition-colors">
                  <Search className="w-4 h-4 text-brown-400 flex-shrink-0" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products…"
                    className="flex-1 bg-transparent outline-none text-sm text-brown-900 placeholder:text-brown-300"
                  />
                  {search && (
                    <button onClick={() => setSearch("")} className="text-brown-400 hover:text-brown-700">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-4 py-2.5 bg-white border border-gold-200 rounded-xl text-sm font-semibold text-brown-700 cursor-pointer focus:border-gold-400 focus:outline-none"
                >
                  {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>Sort: {s.label}</option>)}
                </select>
                <button onClick={() => setFilterOpen(true)} className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gold-200 rounded-xl text-sm font-semibold text-brown-700">
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </button>
              </div>

              <FilterBar filters={TAG_FILTERS} active={tag} onChange={setTag} counts={tagCounts} />

              {error === "offline" && (
                <div className="p-3 bg-gold-50 border border-gold-200 rounded-xl text-xs text-gold-700">
                  ⚡ Backend offline — showing cached products.
                </div>
              )}

              {loading ? (
                <ProductGridSkeleton count={8} />
              ) : displayed.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {displayed.map((p) => <ProductCard key={p.id} product={p} onQuickView={setQuickView} />)}
                </div>
              ) : (
                <EmptyState
                  icon="🔍"
                  title="No products found"
                  description="Try adjusting your filters or search keywords."
                  action={<button onClick={clearAll} className="px-5 py-2 bg-gold-100 hover:bg-gold-200 text-gold-700 rounded-full text-sm font-semibold">Clear All Filters</button>}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-brown-900/50" onClick={() => setFilterOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-ivory p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-brown-900">Filters</h3>
              <button onClick={() => setFilterOpen(false)}><X className="w-5 h-5 text-brown-500" /></button>
            </div>
            <FilterSidebar
              category={category} setCategory={setCategory}
              maxPrice={maxPrice} setMaxPrice={setMaxPrice}
              clearAll={clearAll}
            />
          </div>
        </div>
      )}

      {quickView && <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />}
    </>
  );
}

function FilterSidebar({ category, setCategory, maxPrice, setMaxPrice, clearAll }) {
  return (
    <>
      {/* Categories */}
      <div className="bg-white rounded-2xl p-5 border border-gold-100 shadow-sm">
        <h4 className="font-semibold text-brown-900 mb-3 text-sm">Category</h4>
        <div className="space-y-1">
          {["All", ...categories.map((c) => c.name)].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                category === c ? "bg-gold-50 text-gold-700 font-semibold" : "text-brown-600 hover:bg-gold-50/50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="bg-white rounded-2xl p-5 border border-gold-100 shadow-sm">
        <h4 className="font-semibold text-brown-900 mb-3 text-sm flex items-center justify-between">
          Max Price <span className="font-bold text-gold-700">${maxPrice}</span>
        </h4>
        <input
          type="range" min="3" max="100" step="1"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-gold-500"
        />
        <div className="flex justify-between text-[11px] text-brown-400 mt-1">
          <span>$3</span><span>$100</span>
        </div>
      </div>

      <button onClick={clearAll} className="w-full py-2.5 text-sm font-semibold border border-brown-200 hover:border-clay-400 text-brown-600 hover:text-clay-600 rounded-xl transition-colors">
        Clear All Filters
      </button>
    </>
  );
}
