// Filter chips bar — used on Shop and Featured sections.
export default function FilterBar({ filters, active, onChange, counts = {} }) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((f) => {
        const isActive = active === f;
        const count = counts[f];
        return (
          <button
            key={f}
            onClick={() => onChange(f)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-gold-500 text-white shadow-md shadow-gold-200"
                : "bg-white border border-gold-200 text-brown-600 hover:border-gold-400 hover:text-gold-700 hover:bg-gold-50"
            }`}
          >
            {f}
            {count !== undefined && (
              <span className={`ml-1.5 text-xs ${isActive ? "text-white/70" : "text-brown-400"}`}>
                ({count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
