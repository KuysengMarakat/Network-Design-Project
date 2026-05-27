// Skeleton loader — matches ProductCard dimensions.
export function ProductCardSkeleton() {
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

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => <ProductCardSkeleton key={i} />)}
    </div>
  );
}

export function LineSkeleton({ width = "100%", height = "1rem", className = "" }) {
  return (
    <div
      className={`bg-ivory-dark rounded-full animate-pulse ${className}`}
      style={{ width, height }}
    />
  );
}
