import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CategoryCard({ category }) {
  const gradientMap = {
    "from-gold-100 to-gold-200":               "from-[#f9eecc] to-[#f2d98a]",
    "from-brown-100 to-brown-200":             "from-[#e8d5c4] to-[#cda882]",
    "from-clay-100 to-clay-200":               "from-[#fad9cc] to-[#f4a98a]",
    "from-khmer-green-100 to-khmer-green-200": "from-[#cde2d3] to-[#93c4a1]",
    "from-gold-100 to-clay-100":               "from-[#f9eecc] to-[#fad9cc]",
    "from-brown-100 to-gold-100":              "from-[#e8d5c4] to-[#f9eecc]",
    "from-brown-50 to-gold-100":               "from-[#f7f0eb] to-[#f9eecc]",
  };

  return (
    <Link to={`/shop?category=${encodeURIComponent(category.name)}`} className="group relative cursor-pointer block">
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradientMap[category.color] || "from-gold-100 to-gold-200"} p-6 h-52 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/60`}>
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="80" cy="20" r="30" fill="currentColor" className="text-brown-400" />
            <circle cx="20" cy="80" r="20" fill="currentColor" className="text-brown-400" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="text-4xl mb-2">{category.emoji}</div>
          <h3 className="font-display font-bold text-brown-900 text-xl leading-tight">{category.name}</h3>
          <p className="text-brown-600 text-sm mt-1">{category.description}</p>
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <span className="text-xs font-medium text-brown-500 bg-white/50 px-2.5 py-1 rounded-full">
            {category.count} items
          </span>
          <div className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center shadow-sm group-hover:bg-gold-400 group-hover:text-white transition-all duration-300 group-hover:scale-110">
            <ArrowRight className="w-4 h-4 text-brown-600 group-hover:text-white transition-colors" />
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-brown-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      </div>
    </Link>
  );
}
