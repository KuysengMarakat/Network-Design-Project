// Reusable page-title block with breadcrumb support.
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function PageHeader({ title, subtitle, breadcrumbs = [], children }) {
  return (
    <section className="bg-gradient-to-br from-ivory via-ivory-dark to-ivory border-b border-gold-100 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative dots */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-4 right-8 w-32 h-32 rounded-full bg-gold-200/30 blur-3xl" />
        <div className="absolute bottom-4 left-8 w-24 h-24 rounded-full bg-clay-200/20 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto space-y-3">
        {/* Breadcrumb */}
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-brown-500">
            <Link to="/" className="flex items-center gap-1 hover:text-gold-600 transition-colors">
              <Home className="w-3 h-3" /> Home
            </Link>
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3 text-brown-300" />
                {b.to ? (
                  <Link to={b.to} className="hover:text-gold-600 transition-colors">{b.label}</Link>
                ) : (
                  <span className="text-brown-700 font-medium">{b.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-brown-900">{title}</h1>
            {subtitle && (
              <p className="mt-2 text-sm text-brown-500 max-w-2xl">{subtitle}</p>
            )}
          </div>
          {children && <div className="flex-shrink-0">{children}</div>}
        </div>
      </div>
    </section>
  );
}
