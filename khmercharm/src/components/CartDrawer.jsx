import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function CartDrawer({ isOpen, onClose, onLoginRequired }) {
  const { items, totalUsd, totalKhr, itemCount, updateItem, removeItem, loading } = useCart();
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-brown-900/50 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer panel */}
      <div className="relative w-full max-w-md bg-ivory h-full flex flex-col shadow-2xl">
        {/* Top bar */}
        <div className="h-0.5 bg-gradient-to-r from-clay-400 via-gold-400 to-khmer-green-500" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gold-100">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-gold-600" />
            <h2 className="font-display text-lg font-bold text-brown-900">Your Cart</h2>
            {itemCount > 0 && (
              <span className="w-5 h-5 bg-clay-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-brown-100 text-brown-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {!user ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
              <div className="text-5xl">🛒</div>
              <p className="font-display text-lg text-brown-700">Sign in to view your cart</p>
              <p className="text-sm text-brown-400">Login to start adding items to your cart.</p>
              <button onClick={() => { onClose(); onLoginRequired?.(); }}
                className="px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-white font-semibold rounded-xl transition-colors">
                Login / Register
              </button>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-8 h-8 border-2 border-gold-300 border-t-gold-600 rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
              <div className="text-5xl">🌸</div>
              <p className="font-display text-lg text-brown-700">Your cart is empty</p>
              <p className="text-sm text-brown-400">Browse our collections and add something beautiful.</p>
              <button onClick={onClose}
                className="px-6 py-2.5 bg-gold-50 border border-gold-300 hover:bg-gold-100 text-gold-700 font-semibold rounded-xl transition-colors">
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.cart_id} className="flex gap-3 bg-white rounded-2xl p-3 border border-gold-100 shadow-sm">
                {/* Product emoji */}
                <div className="w-16 h-16 rounded-xl bg-ivory-dark flex items-center justify-center text-2xl flex-shrink-0">
                  {emojiFor(item.name)}
                </div>
                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brown-900 truncate">{item.name}</p>
                  <p className="text-xs text-brown-400 mt-0.5">{item.category}</p>
                  <p className="text-sm font-bold text-gold-700 mt-1">
                    ${(item.price_usd * item.quantity).toFixed(2)}
                    <span className="text-xs font-normal text-brown-400 ml-1">
                      ({(item.price_khr * item.quantity).toLocaleString()}៛)
                    </span>
                  </p>
                </div>
                {/* Qty + remove */}
                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => removeItem(item.cart_id)}
                    className="p-1 rounded-lg text-brown-300 hover:text-clay-500 hover:bg-clay-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-1">
                    <button onClick={() => item.quantity > 1 ? updateItem(item.cart_id, item.quantity - 1) : removeItem(item.cart_id)}
                      className="w-6 h-6 rounded-lg bg-ivory-dark hover:bg-gold-100 flex items-center justify-center transition-colors">
                      <Minus className="w-3 h-3 text-brown-600" />
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-brown-900">{item.quantity}</span>
                    <button onClick={() => updateItem(item.cart_id, item.quantity + 1)}
                      className="w-6 h-6 rounded-lg bg-ivory-dark hover:bg-gold-100 flex items-center justify-center transition-colors">
                      <Plus className="w-3 h-3 text-brown-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer — totals + checkout */}
        {user && items.length > 0 && (
          <div className="border-t border-gold-100 px-5 py-4 space-y-3 bg-white">
            <div className="flex justify-between text-sm text-brown-500">
              <span>{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
              <span>{totalKhr.toLocaleString()}៛</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="font-semibold text-brown-800">Total</span>
              <span className="font-display text-2xl font-bold text-brown-900">${totalUsd.toFixed(2)}</span>
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="w-full py-2 text-sm text-brown-500 hover:text-gold-600 transition-colors">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function emojiFor(name = "") {
  const map = {
    "Golden Lotus Bracelet":  "💛",
    "Angkor Pearl Necklace":  "📿",
    "Silk Charm Hair Clip":   "🌸",
    "Handmade Woven Bag":     "👜",
    "Khmer Pattern Ring":     "💍",
    "Mini Lotus Phone Charm": "🌺",
    "Royal Gold Earrings":    "✨",
    "Clay Stone Keychain":    "🗝️",
  };
  return map[name] ?? "💎";
}
