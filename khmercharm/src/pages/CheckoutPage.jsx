import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { CheckCircle2, MapPin, CreditCard, User, ArrowRight, Truck } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import ProductIllustration from "../components/ProductIllustration";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { ordersAPI } from "../api/api";

const PROVINCES = ["Phnom Penh", "Siem Reap", "Battambang", "Sihanoukville", "Kampot", "Kep", "Kampong Cham", "Pursat", "Other"];
const PAYMENT_METHODS = [
  { id: "cod",  label: "Cash on Delivery",   emoji: "💵", desc: "Pay when you receive your order" },
  { id: "aba",  label: "ABA Demo Payment",    emoji: "🏦", desc: "Demo only — no real payment processed" },
  { id: "wing", label: "Wing Demo Payment",   emoji: "📱", desc: "Demo only — no real payment processed" },
];

export default function CheckoutPage() {
  const { items, totalUsd, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const stateExtra = location.state || {};

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    province: "Phnom Penh",
    district: "",
    address: "",
    note: "",
    payment: "cod",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const deliveryFee = stateExtra.deliveryFee ?? (totalUsd > 25 ? 0 : 2.50);
  const discount   = stateExtra.promo ? totalUsd * stateExtra.promo.discount : 0;
  const finalUsd   = Math.max(0, totalUsd + deliveryFee - discount);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    const fullAddress = `${form.address}, ${form.district}, ${form.province}`;
    try {
      const res = await ordersAPI.create(fullAddress, form.phone);
      setSuccess({ orderId: res.data.order.id, totalUsd: finalUsd, payment: form.payment });
      clearCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast.error(err.message || "Could not place order");
    } finally {
      setSubmitting(false);
    }
  };

  // Empty cart redirect
  if (!success && items.length === 0) {
    return (
      <>
        <PageHeader title="Checkout" breadcrumbs={[{ label: "Cart", to: "/cart" }, { label: "Checkout" }]} />
        <section className="py-16 px-4 text-center bg-ivory min-h-[40vh]">
          <p className="text-brown-500 mb-4">Your cart is empty.</p>
          <Link to="/shop" className="px-5 py-2.5 bg-gold-500 hover:bg-gold-400 text-white font-semibold rounded-xl">Continue Shopping</Link>
        </section>
      </>
    );
  }

  // Success screen
  if (success) {
    return (
      <>
        <PageHeader title="Order Confirmed" breadcrumbs={[{ label: "Order success" }]} />
        <section className="py-16 px-4 bg-ivory min-h-[60vh]">
          <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl p-8 sm:p-12 text-center space-y-5 border border-gold-100">
            <div className="w-20 h-20 mx-auto bg-khmer-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-khmer-green-600" />
            </div>
            <h2 className="font-display text-3xl font-bold text-brown-900">Thank you! 🎉</h2>
            <p className="text-brown-600">
              Your order has been placed successfully. We'll send a confirmation email shortly.
            </p>
            <div className="bg-ivory-dark rounded-2xl p-4 text-left space-y-1.5">
              <div className="flex justify-between text-sm"><span className="text-brown-500">Order ID</span><span className="font-mono font-bold text-brown-900">#{success.orderId}</span></div>
              <div className="flex justify-between text-sm"><span className="text-brown-500">Total</span><span className="font-bold text-brown-900">${success.totalUsd.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-brown-500">Payment</span><span className="font-semibold text-brown-900 capitalize">{success.payment === "cod" ? "Cash on Delivery" : success.payment.toUpperCase()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-brown-500">Status</span><span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase">Pending</span></div>
            </div>
            <div className="flex gap-3 pt-2">
              <Link to="/shop" className="flex-1 py-3 border border-gold-300 text-gold-700 hover:bg-gold-50 rounded-xl text-sm font-semibold">Continue Shopping</Link>
              <Link to="/account?tab=orders" className="flex-1 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold rounded-xl flex items-center justify-center gap-1.5">
                Track Order <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-[11px] text-brown-400 pt-2">⚠️ Demo order — no real payment processed.</p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Checkout" subtitle="Complete your order in just a few steps" breadcrumbs={[{ label: "Cart", to: "/cart" }, { label: "Checkout" }]} />

      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-ivory">
        <div className="max-w-6xl mx-auto">
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_400px] gap-6">

            <div className="space-y-5">
              {/* Contact */}
              <div className="bg-white rounded-2xl p-5 border border-gold-100 shadow-sm">
                <h3 className="font-display font-bold text-brown-900 flex items-center gap-2 mb-4">
                  <User className="w-4 h-4 text-gold-600" /> Contact Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Full Name *"><Input value={form.name} onChange={f("name")} required /></Field>
                  <Field label="Phone Number *"><Input value={form.phone} onChange={f("phone")} placeholder="+855…" required /></Field>
                  <Field label="Email" className="sm:col-span-2"><Input type="email" value={form.email} onChange={f("email")} /></Field>
                </div>
              </div>

              {/* Delivery */}
              <div className="bg-white rounded-2xl p-5 border border-gold-100 shadow-sm">
                <h3 className="font-display font-bold text-brown-900 flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-gold-600" /> Delivery Address
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Province / City *">
                    <select value={form.province} onChange={f("province")} className="w-full px-3 py-2.5 bg-ivory border border-gold-200 rounded-xl text-sm focus:border-gold-400 focus:outline-none">
                      {PROVINCES.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </Field>
                  <Field label="District / Khan"><Input value={form.district} onChange={f("district")} placeholder="e.g. Daun Penh" /></Field>
                  <Field label="Street Address *" className="sm:col-span-2"><Input value={form.address} onChange={f("address")} placeholder="House #, Street #, Sangkat" required /></Field>
                  <Field label="Delivery Note (optional)" className="sm:col-span-2">
                    <textarea value={form.note} onChange={f("note")} rows={2} placeholder="Anything we should know?" className="w-full px-3 py-2 bg-ivory border border-gold-200 rounded-xl text-sm resize-none focus:border-gold-400 focus:outline-none" />
                  </Field>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl p-5 border border-gold-100 shadow-sm">
                <h3 className="font-display font-bold text-brown-900 flex items-center gap-2 mb-4">
                  <CreditCard className="w-4 h-4 text-gold-600" /> Payment Method
                </h3>
                <div className="space-y-2">
                  {PAYMENT_METHODS.map((m) => (
                    <label key={m.id} className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                      form.payment === m.id ? "border-gold-400 bg-gold-50" : "border-gold-100 hover:border-gold-200"
                    }`}>
                      <input type="radio" name="payment" value={m.id} checked={form.payment === m.id} onChange={f("payment")} className="accent-gold-500" />
                      <span className="text-2xl">{m.emoji}</span>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-brown-900">{m.label}</div>
                        <div className="text-[11px] text-brown-400">{m.desc}</div>
                      </div>
                      {form.payment === m.id && <CheckCircle2 className="w-5 h-5 text-gold-600" />}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary sidebar */}
            <aside className="self-start space-y-3 lg:sticky lg:top-20">
              <div className="bg-white rounded-2xl p-5 border border-gold-100 shadow-sm space-y-4">
                <h3 className="font-display font-bold text-brown-900 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gold-600" /> Order Summary
                </h3>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.cart_id} className="flex gap-3">
                      <div className="w-14 h-14 rounded-lg bg-ivory-dark flex-shrink-0 overflow-hidden">
                        <ProductIllustration product={{ name: item.name }} size="sm" showLabel={false} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-brown-900 truncate">{item.name}</p>
                        <p className="text-xs text-brown-400">×{item.quantity}</p>
                      </div>
                      <div className="text-sm font-bold text-brown-900">${(item.price_usd * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gold-100 pt-3 space-y-1 text-sm">
                  <div className="flex justify-between text-brown-600"><span>Subtotal</span><span>${totalUsd.toFixed(2)}</span></div>
                  <div className="flex justify-between text-brown-600"><span>Delivery</span><span className={deliveryFee === 0 ? "text-khmer-green-600 font-semibold" : ""}>{deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}</span></div>
                  {discount > 0 && <div className="flex justify-between text-clay-600"><span>Discount</span><span>−${discount.toFixed(2)}</span></div>}
                </div>

                <div className="border-t border-gold-100 pt-3 flex justify-between items-baseline">
                  <span className="font-semibold text-brown-900">Total</span>
                  <div className="text-right">
                    <div className="font-display text-xl font-bold text-brown-900">${finalUsd.toFixed(2)}</div>
                    <div className="text-xs text-brown-400">{Math.round(finalUsd * 4000).toLocaleString()}៛</div>
                  </div>
                </div>

                <button type="submit" disabled={submitting} className="w-full py-3.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 disabled:opacity-60 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all">
                  {submitting ? "Placing order…" : "Place Demo Order"}
                </button>
                <p className="text-[10px] text-center text-brown-400">⚠️ Demo only — no real payment processed</p>
              </div>
            </aside>
          </form>
        </div>
      </section>
    </>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-xs font-semibold text-brown-700">{label}</label>
      {children}
    </div>
  );
}
function Input(props) {
  return <input {...props} className="w-full px-3 py-2.5 bg-ivory border border-gold-200 rounded-xl text-sm text-brown-900 placeholder:text-brown-300 focus:border-gold-400 focus:outline-none focus:bg-white transition-colors" />;
}
