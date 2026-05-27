import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import ProductIllustration from "../components/ProductIllustration";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const PROMO_CODES = {
  "WELCOME10":  { discount: 0.10, label: "10% off welcome" },
  "KHMER15":    { discount: 0.15, label: "15% off Khmer New Year" },
  "LOTUS5":     { discount: 0.05, label: "5% off lotus collection" },
};

export default function CartPage() {
  const { items, totalUsd, totalKhr, itemCount, updateItem, removeItem, loading, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);

  const applyPromo = () => {
    const code = promoCode.toUpperCase().trim();
    if (PROMO_CODES[code]) {
      setAppliedPromo({ code, ...PROMO_CODES[code] });
      toast.success(`Promo applied: ${PROMO_CODES[code].label}`);
    } else {
      toast.error("Invalid promo code");
    }
  };

  const subtotalUsd = totalUsd;
  const deliveryFee = subtotalUsd > 25 ? 0 : 2.50;
  const discountAmount = appliedPromo ? subtotalUsd * appliedPromo.discount : 0;
  const finalTotalUsd  = Math.max(0, subtotalUsd + deliveryFee - discountAmount);
  const finalTotalKhr  = Math.round(finalTotalUsd * 4000);

  const handleCheckout = () => {
    if (!user) { toast.info("Please login to checkout"); navigate("/login?redirect=/checkout"); return; }
    if (items.length === 0) { toast.error("Your cart is empty"); return; }
    navigate("/checkout", { state: { promo: appliedPromo, deliveryFee } });
  };

  return (
    <>
      <PageHeader
        title="Your Cart"
        subtitle={user ? `${itemCount} item${itemCount !== 1 ? "s" : ""} in your cart` : "Login to start shopping"}
        breadcrumbs={[{ label: "Cart" }]}
      />

      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-ivory min-h-[60vh]">
        <div className="max-w-6xl mx-auto">
          {!user ? (
            <EmptyState
              icon="🔐"
              title="Sign in to view your cart"
              description="Login to your account to add items and checkout."
              action={<Link to="/login" className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all">Login / Register</Link>}
            />
          ) : loading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-2 border-gold-300 border-t-gold-600 rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon="🌸"
              title="Your cart is empty"
              description="Browse our collections and add some Cambodian charm to your day."
              action={<Link to="/shop" className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all">Continue Shopping</Link>}
            />
          ) : (
            <div className="grid lg:grid-cols-[1fr_380px] gap-6">

              {/* Items list */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold text-brown-900">Items ({itemCount})</h2>
                  <button onClick={clearCart} className="text-xs text-clay-500 hover:text-clay-600 font-semibold">Clear all</button>
                </div>

                {items.map((item) => (
                  <div key={item.cart_id} className="bg-white rounded-2xl p-4 border border-gold-100 shadow-sm flex gap-4">
                    <Link to={`/product/${item.product_id}`} className="w-24 h-24 rounded-xl bg-ivory-dark flex-shrink-0 overflow-hidden">
                      <ProductIllustration product={{ name: item.name }} showLabel={false} />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.product_id}`} className="font-semibold text-brown-900 hover:text-gold-700 transition-colors line-clamp-2">{item.name}</Link>
                      <p className="text-xs text-brown-400 mt-0.5">{item.category}</p>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="font-bold text-gold-700">${(item.price_usd * item.quantity).toFixed(2)}</span>
                        <span className="text-xs text-brown-400">{(item.price_khr * item.quantity).toLocaleString()}៛</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="flex items-center border border-gold-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => item.quantity > 1 ? updateItem(item.cart_id, item.quantity - 1) : removeItem(item.cart_id)}
                            className="px-2.5 py-1 hover:bg-gold-50 text-brown-600"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 py-1 text-sm font-bold text-brown-900 min-w-[36px] text-center">{item.quantity}</span>
                          <button onClick={() => updateItem(item.cart_id, item.quantity + 1)} className="px-2.5 py-1 hover:bg-gold-50 text-brown-600">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button onClick={() => removeItem(item.cart_id)} className="text-brown-300 hover:text-clay-500 p-1.5 rounded-lg hover:bg-clay-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700 hover:text-gold-600 mt-4">
                  ← Continue Shopping
                </Link>
              </div>

              {/* Summary */}
              <aside className="lg:sticky lg:top-20 self-start space-y-3">
                <div className="bg-white rounded-2xl p-5 border border-gold-100 shadow-sm space-y-4">
                  <h3 className="font-display font-bold text-brown-900 text-lg">Order Summary</h3>

                  {/* Promo */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brown-600 flex items-center gap-1"><Tag className="w-3 h-3" /> Promo Code</label>
                    <div className="flex gap-2">
                      <input
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="WELCOME10"
                        className="flex-1 px-3 py-2 bg-ivory border border-gold-200 rounded-lg text-sm uppercase outline-none focus:border-gold-400"
                      />
                      <button onClick={applyPromo} className="px-3 py-2 bg-brown-800 hover:bg-brown-900 text-white text-xs font-semibold rounded-lg transition-colors">
                        Apply
                      </button>
                    </div>
                    {appliedPromo && (
                      <div className="flex items-center justify-between bg-khmer-green-50 border border-khmer-green-200 rounded-lg px-3 py-1.5 text-xs">
                        <span className="text-khmer-green-700 font-semibold">✓ {appliedPromo.code}</span>
                        <button onClick={() => setAppliedPromo(null)} className="text-khmer-green-600 hover:underline">Remove</button>
                      </div>
                    )}
                    <p className="text-[10px] text-brown-400">Try: WELCOME10, KHMER15, LOTUS5</p>
                  </div>

                  <div className="border-t border-gold-100 pt-3 space-y-1.5 text-sm">
                    <div className="flex justify-between text-brown-600">
                      <span>Subtotal</span><span>${subtotalUsd.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-brown-600">
                      <span>Delivery</span>
                      <span className={deliveryFee === 0 ? "text-khmer-green-600 font-semibold" : ""}>
                        {deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}
                      </span>
                    </div>
                    {appliedPromo && (
                      <div className="flex justify-between text-clay-600">
                        <span>Discount ({appliedPromo.code})</span>
                        <span>−${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gold-100 pt-3 flex justify-between items-baseline">
                    <span className="font-display font-semibold text-brown-900">Total</span>
                    <div className="text-right">
                      <div className="font-display text-2xl font-bold text-brown-900">${finalTotalUsd.toFixed(2)}</div>
                      <div className="text-xs text-brown-400">{finalTotalKhr.toLocaleString()}៛</div>
                    </div>
                  </div>

                  <button onClick={handleCheckout} className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all">
                    <ShoppingBag className="w-4 h-4" /> Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </button>

                  {deliveryFee > 0 && (
                    <p className="text-[11px] text-center text-brown-400">
                      Add ${(25 - subtotalUsd).toFixed(2)} more for <span className="text-khmer-green-600 font-semibold">FREE delivery</span>
                    </p>
                  )}
                </div>

                <div className="bg-gold-50/50 border border-gold-100 rounded-2xl p-4 text-xs text-brown-600 space-y-1.5">
                  <div className="flex items-center gap-2">🚚 <span>Same-day delivery in Phnom Penh</span></div>
                  <div className="flex items-center gap-2">↩️ <span>30-day easy returns</span></div>
                  <div className="flex items-center gap-2">🇰🇭 <span>Made with Khmer Charm</span></div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
