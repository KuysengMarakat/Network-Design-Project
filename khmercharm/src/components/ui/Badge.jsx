// Small label / status badge.
const VARIANTS = {
  new:        "bg-khmer-green-500 text-white",
  popular:    "bg-gold-400 text-white",
  sale:       "bg-clay-500 text-white",
  default:    "bg-brown-100 text-brown-700",
  outline:    "bg-white border border-gold-200 text-gold-700",
  green:      "bg-khmer-green-50 text-khmer-green-700 border border-khmer-green-200",
  red:        "bg-clay-50 text-clay-700 border border-clay-200",
  yellow:     "bg-gold-50 text-gold-700 border border-gold-200",
};

export default function Badge({ children, variant = "default", className = "", ...props }) {
  const tagKey = String(variant).toLowerCase();
  const cls = VARIANTS[tagKey] || VARIANTS.default;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${cls} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
