import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CategoryCard from "./components/CategoryCard";
import ProductCard from "./components/ProductCard";
import CollectionBanner from "./components/CollectionBanner";
import Benefits from "./components/Benefits";
import Reviews from "./components/Reviews";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import { categories, products, reviews, benefits } from "./data/sampleData";

const FILTERS = ["All", "New Arrival", "Best Seller", "Sale"];

const filterMap = {
  "All": () => true,
  "New Arrival": (p) => p.tag === "New",
  "Best Seller": (p) => p.tag === "Popular",
  "Sale": (p) => p.onSale === true,
};

export default function App() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProducts = products.filter(filterMap[activeFilter] || (() => true));

  return (
    <div className="min-h-screen bg-ivory font-body">
      <Navbar cartCount={2} />

      {/* Hero */}
      <Hero />

      {/* Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-ivory-dark silk-texture" id="shop">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="text-gold-600 text-sm font-semibold uppercase tracking-widest">
              Browse by Category
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-brown-900">
              Shop Our Collections
            </h2>
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-400" />
              <div className="w-2 h-2 rounded-full bg-gold-400" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-400" />
            </div>
          </div>

          {/* Category cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-ivory lotus-pattern">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-gold-600 text-sm font-semibold uppercase tracking-widest">
                Handpicked for you
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-brown-900">
                Featured Products
              </h2>
            </div>
            <a href="#" className="text-sm font-medium text-gold-600 hover:text-gold-700 border-b border-gold-300 hover:border-gold-500 transition-colors whitespace-nowrap">
              View All Products →
            </a>
          </div>

          {/* Filter bar */}
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === filter
                    ? "bg-gold-500 text-white shadow-md shadow-gold-200"
                    : "bg-white border border-gold-200 text-brown-600 hover:border-gold-400 hover:text-gold-700 hover:bg-gold-50"
                }`}
              >
                {filter}
                {filter !== "All" && (
                  <span className={`ml-1.5 text-xs ${activeFilter === filter ? "text-white/70" : "text-brown-400"}`}>
                    ({products.filter(filterMap[filter] || (() => true)).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Product grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-brown-400">
              <div className="text-4xl mb-3">🌸</div>
              <p className="font-display text-lg">No products in this category yet</p>
              <p className="text-sm mt-1">Check back soon for new arrivals!</p>
              <button
                onClick={() => setActiveFilter("All")}
                className="mt-4 px-5 py-2 bg-gold-100 hover:bg-gold-200 text-gold-700 rounded-full text-sm font-medium transition-colors"
              >
                View All Products
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Collection Banner */}
      <CollectionBanner />

      {/* Benefits + About */}
      <Benefits benefits={benefits} />

      {/* Reviews */}
      <Reviews reviews={reviews} />

      {/* Newsletter */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </div>
  );
}
