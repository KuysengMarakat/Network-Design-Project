import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, Sparkles, LogOut, Package, ChevronDown, Shield, Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount }    = useCart();
  const { count: wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen,   setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const dropRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinks = [
    { to: "/",            label: "Home" },
    { to: "/shop",        label: "Shop" },
    { to: "/collections", label: "Collections" },
    { to: "/about",       label: "About" },
    { to: "/contact",     label: "Contact" },
  ];

  const linkClasses = ({ isActive }) =>
    `px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative group ${
      isActive ? "text-gold-700 bg-gold-50" : "text-brown-600 hover:text-gold-600 hover:bg-gold-50"
    }`;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQ.trim())}`);
      setSearchOpen(false);
      setSearchQ("");
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-ivory/95 backdrop-blur-md shadow-md shadow-brown-100/50"
               : "bg-ivory/80 backdrop-blur-sm"
    }`}>
      <div className="h-0.5 bg-gradient-to-r from-clay-400 via-gold-400 to-khmer-green-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-clay-500 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-brown-800 group-hover:text-gold-600 transition-colors">
              KhmerCharm
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClasses} end={l.to === "/"}>{l.label}</NavLink>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button onClick={() => setSearchOpen((v) => !v)} className="p-2 text-brown-500 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-all">
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 text-brown-500 hover:text-clay-500 hover:bg-clay-50 rounded-lg transition-all">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-clay-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-brown-500 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-all">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="relative hidden md:block ml-1" ref={dropRef}>
                <button
                  onClick={() => setDropdown((v) => !v)}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-gold-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold-400 to-clay-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <span className="text-sm font-medium text-brown-700 max-w-[80px] truncate">{user.name}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-brown-400 transition-transform ${dropdown ? "rotate-180" : ""}`} />
                </button>

                {dropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gold-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gold-50">
                      <p className="text-sm font-semibold text-brown-900 truncate">{user.name}</p>
                      <p className="text-xs text-brown-400 truncate">{user.email}</p>
                      {user.role === "admin" && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-clay-100 text-clay-600 text-[10px] font-bold rounded-full uppercase tracking-wide">Admin</span>
                      )}
                    </div>
                    <Link to="/account" onClick={() => setDropdown(false)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-brown-600 hover:bg-gold-50 hover:text-gold-700 transition-colors">
                      <User className="w-4 h-4" /> My Account
                    </Link>
                    <Link to="/account?tab=orders" onClick={() => setDropdown(false)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-brown-600 hover:bg-gold-50 hover:text-gold-700 transition-colors">
                      <Package className="w-4 h-4" /> My Orders
                    </Link>
                    <Link to="/wishlist" onClick={() => setDropdown(false)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-brown-600 hover:bg-gold-50 hover:text-gold-700 transition-colors">
                      <Heart className="w-4 h-4" /> Wishlist
                      {wishlistCount > 0 && <span className="ml-auto text-xs text-brown-400">({wishlistCount})</span>}
                    </Link>
                    {user.role === "admin" && (
                      <Link to="/admin" onClick={() => setDropdown(false)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-clay-600 hover:bg-clay-50 font-semibold transition-colors">
                        <Shield className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    <div className="border-t border-gold-50 mt-1 pt-1">
                      <button
                        onClick={() => { logout(); setDropdown(false); navigate("/"); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-clay-600 hover:bg-clay-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-1.5 ml-1 px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                <User className="w-4 h-4" /> Login
              </Link>
            )}

            {/* Hamburger */}
            <button className="md:hidden p-2 text-brown-600 hover:bg-gold-50 rounded-lg transition-colors" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-t border-gold-100 bg-ivory/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-white border border-gold-200 focus-within:border-gold-400 rounded-xl px-4 py-2.5 transition-colors">
              <Search className="w-4 h-4 text-brown-400 flex-shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search bracelets, necklaces, lotus…"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm text-brown-900 placeholder:text-brown-300"
              />
            </div>
            <button type="submit" className="px-5 py-2.5 bg-gold-500 hover:bg-gold-400 text-white text-sm font-semibold rounded-xl transition-colors">
              Search
            </button>
            <button type="button" onClick={() => setSearchOpen(false)} className="px-3 py-2.5 text-brown-400 hover:text-brown-700 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="bg-ivory border-t border-gold-100 px-4 pb-4 pt-2 space-y-1">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive ? "text-gold-700 bg-gold-50" : "text-brown-600 hover:text-gold-600 hover:bg-gold-50"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <div className="pt-2 border-t border-gold-100 space-y-2">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-clay-500 flex items-center justify-center text-white text-sm font-bold">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brown-900">{user.name}</p>
                    <p className="text-xs text-brown-400">{user.email}</p>
                  </div>
                </div>
                <Link to="/account" className="block px-4 py-2.5 text-sm text-brown-600 hover:bg-gold-50 rounded-lg">My Account</Link>
                {user.role === "admin" && (
                  <Link to="/admin" className="block px-4 py-2.5 text-sm font-semibold text-clay-600 hover:bg-clay-50 rounded-lg">Admin Dashboard</Link>
                )}
                <button
                  onClick={() => { logout(); navigate("/"); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-clay-50 border border-clay-200 text-clay-600 text-sm font-medium rounded-lg"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <Link to="/login" className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-white text-sm font-medium rounded-lg">
                <User className="w-4 h-4" /> Login / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
