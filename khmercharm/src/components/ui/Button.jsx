// Reusable Button — supports variants, sizes, loading, and icons.
import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary:   "bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white shadow-md hover:shadow-lg shadow-gold-200",
  secondary: "bg-white border-2 border-gold-300 hover:border-gold-500 text-brown-700 hover:text-gold-700 shadow-sm hover:shadow-md",
  outline:   "bg-transparent border border-brown-200 hover:border-gold-400 text-brown-600 hover:text-gold-700 hover:bg-gold-50",
  ghost:     "bg-transparent hover:bg-gold-50 text-brown-600 hover:text-gold-700",
  danger:    "bg-clay-500 hover:bg-clay-600 text-white shadow-md hover:shadow-lg",
  dark:      "bg-brown-800 hover:bg-brown-900 text-white shadow-md",
};

const SIZES = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
