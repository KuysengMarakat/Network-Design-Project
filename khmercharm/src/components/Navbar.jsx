import { useState, useEffect } from "react";
import { Search, ShoppingCart, User, Menu, X, Sparkles } from "lucide-react";

export default function Navbar({ cartCount = 2 }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["Home", "Shop", "Collections", "About", "Contact"];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-ivory/95 backdrop-blur-md shadow-md shadow-brown-100/50"
          : "bg-ivory/80 backdrop-blur-sm"
      }`}
    >
      {/* Top accent bar */}
      <div className="h-0.5 bg-gradient-to-r from-clay-400 via-gold-400 to-khmer-green-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-clay-500 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-brown-800 group-hover:text-gold-600 transition-colors">
              KhmerCharm
            </span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="px-4 py-2 text-sm font-medium text-brown-600 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-all duration-200 relative group"
              >
                {link}
                <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-gold-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full" />
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button className="p-2 text-brown-500 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-all duration-200">
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <button className="relative p-2 text-brown-500 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-all duration-200">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-clay-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Login - desktop */}
            <button className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
              <User className="w-4 h-4" />
              Login
            </button>

            {/* Hamburger */}
            <button
              className="md:hidden p-2 text-brown-600 hover:bg-gold-50 rounded-lg transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-ivory border-t border-gold-100 px-4 pb-4 pt-2 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 text-sm font-medium text-brown-600 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-colors"
            >
              {link}
            </a>
          ))}
          <div className="pt-2 border-t border-gold-100">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-white text-sm font-medium rounded-lg">
              <User className="w-4 h-4" />
              Login / Register
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
