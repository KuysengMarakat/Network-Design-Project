import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { User, Package, Heart, MapPin, LogOut, ChevronRight, Calendar, ShoppingBag } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import { ordersAPI } from "../api/api";

const STATUS_STYLE = {
  pending:    "bg-yellow-100 text-yellow-700 border-yellow-200",
  processing: "bg-blue-100 text-blue-700 border-blue-200",
  shipped:    "bg-purple-100 text-purple-700 border-purple-200",
  delivered:  "bg-green-100 text-green-700 border-green-200",
  cancelled:  "bg-red-100 text-red-700 border-red-200",
};

export default function AccountPage() {
  const { user, logout, loading } = useAuth();
  const { items: wishlist, count: wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "profile";

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/login?redirect=/account");
  }, [loading, user, navigate]);

  useEffect(() => {
    if (user && tab === "orders") {
      setOrdersLoading(true);
      ordersAPI.getAll()
        .then((res) => setOrders(res.data.orders || []))
        .catch(() => {})
        .finally(() => setOrdersLoading(false));
    }
  }, [user, tab]);

  if (!user) return null;

  const TABS = [
    { id: "profile",  label: "Profile",   icon: User,       count: null },
    { id: "orders",   label: "Orders",    icon: Package,    count: orders.length },
    { id: "wishlist", label: "Wishlist",  icon: Heart,      count: wishlistCount },
    { id: "addresses",label: "Addresses", icon: MapPin,     count: null },
  ];

  const setTab = (t) => setSearchParams({ tab: t }, { replace: true });

  return (
    <>
      <PageHeader title="My Account" subtitle={`Welcome back, ${user.name}`} breadcrumbs={[{ label: "Account" }]} />

      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-ivory min-h-[60vh]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[260px_1fr] gap-6">

          {/* Sidebar */}
          <aside className="space-y-3 lg:sticky lg:top-20 self-start">
            <div className="bg-white rounded-2xl p-5 border border-gold-100 shadow-sm">
              <div className="flex items-center gap-3 pb-3 border-b border-gold-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-clay-500 flex items-center justify-center text-white font-bold text-lg">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-brown-900 truncate">{user.name}</p>
                  <p className="text-xs text-brown-400 truncate">{user.email}</p>
                  {user.role === "admin" && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-clay-100 text-clay-600 text-[10px] font-bold rounded-full uppercase">Admin</span>
                  )}
                </div>
              </div>

              <nav className="mt-3 space-y-0.5">
                {TABS.map(({ id, label, icon: Icon, count }) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      tab === id ? "bg-gold-50 text-gold-700 font-semibold" : "text-brown-600 hover:bg-gold-50/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {label}
                    {count !== null && count > 0 && <span className="ml-auto text-xs text-brown-400">({count})</span>}
                  </button>
                ))}
                <div className="pt-2 mt-2 border-t border-gold-100">
                  <button
                    onClick={() => { logout(); navigate("/"); toast.success("Signed out"); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-clay-600 hover:bg-clay-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="min-w-0">
            {tab === "profile" && <ProfileTab user={user} />}
            {tab === "orders"  && <OrdersTab orders={orders} loading={ordersLoading} />}
            {tab === "wishlist"&& <WishlistTab items={wishlist} />}
            {tab === "addresses" && <AddressesTab />}
          </div>
        </div>
      </section>
    </>
  );
}

function ProfileTab({ user }) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-6 border border-gold-100 shadow-sm">
        <h2 className="font-display text-xl font-bold text-brown-900 mb-4">Profile Information</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <Field label="Full Name" value={user.name} />
          <Field label="Email"     value={user.email} />
          <Field label="Role"      value={user.role} />
          <Field label="Member Since" value={user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"} />
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Orders",   value: 0, color: "bg-gold-50 text-gold-700",        icon: Package },
          { label: "Wishlist", value: 0, color: "bg-clay-50 text-clay-700",        icon: Heart },
          { label: "Addresses",value: 1, color: "bg-khmer-green-50 text-khmer-green-700", icon: MapPin },
          { label: "Reviews",  value: 0, color: "bg-brown-50 text-brown-700",      icon: User },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-gold-100 shadow-sm">
            <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center mb-2`}>
              <s.icon className="w-4 h-4" />
            </div>
            <div className="font-display text-2xl font-bold text-brown-900">{s.value}</div>
            <div className="text-xs text-brown-400">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <div className="text-xs text-brown-400 uppercase tracking-wide font-semibold mb-1">{label}</div>
      <div className="text-brown-900 font-medium">{value || "—"}</div>
    </div>
  );
}

function OrdersTab({ orders, loading }) {
  if (loading) return <div className="bg-white rounded-2xl p-12 text-center border border-gold-100">Loading orders…</div>;
  if (orders.length === 0) return (
    <div className="bg-white rounded-2xl p-6 border border-gold-100 shadow-sm">
      <EmptyState icon="📦" title="No orders yet" description="When you place your first order, it'll appear here."
        action={<Link to="/shop" className="px-5 py-2.5 bg-gold-500 hover:bg-gold-400 text-white font-semibold rounded-xl">Start Shopping</Link>} />
    </div>
  );

  return (
    <div className="space-y-3">
      <h2 className="font-display text-xl font-bold text-brown-900">Order History</h2>
      {orders.map((o) => (
        <div key={o.id} className="bg-white rounded-2xl p-5 border border-gold-100 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <div className="font-mono text-xs text-brown-400 bg-ivory-dark px-2 py-1 rounded-lg">#{o.id}</div>
            <div className="flex-1 flex items-center gap-2 text-xs text-brown-500">
              <Calendar className="w-3 h-3" /> {new Date(o.created_at).toLocaleDateString()}
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${STATUS_STYLE[o.status] || "bg-gray-100 text-gray-600"}`}>
              {o.status}
            </span>
            <span className="font-bold text-brown-900">${o.total_usd?.toFixed(2)}</span>
          </div>
          {o.items && o.items.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-2 text-xs text-brown-600 border-t border-gold-100 pt-3">
              {o.items.slice(0, 4).map((i) => (
                <div key={i.id} className="flex items-center gap-2">
                  <ShoppingBag className="w-3 h-3 text-gold-500" />
                  <span className="truncate">{i.name} × {i.quantity}</span>
                </div>
              ))}
              {o.items.length > 4 && <div className="text-brown-400">+ {o.items.length - 4} more</div>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function WishlistTab({ items }) {
  if (items.length === 0) return (
    <div className="bg-white rounded-2xl p-6 border border-gold-100 shadow-sm">
      <EmptyState icon="💝" title="No saved items" description="Tap the heart on any product to save it here."
        action={<Link to="/shop" className="px-5 py-2.5 bg-gold-500 hover:bg-gold-400 text-white font-semibold rounded-xl">Browse Products</Link>} />
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-brown-900">Wishlist Preview</h2>
        <Link to="/wishlist" className="text-sm font-semibold text-gold-700 hover:text-gold-600 flex items-center gap-1">
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.slice(0, 6).map((p) => (
          <Link key={p.id} to={`/product/${p.id}`} className="bg-white rounded-2xl p-3 border border-gold-100 shadow-sm hover:shadow-md transition-all">
            <div className="text-3xl text-center py-2">💝</div>
            <p className="text-sm font-semibold text-brown-900 truncate">{p.name}</p>
            <p className="text-xs text-brown-400">${p.priceUSD.toFixed(2)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function AddressesTab() {
  return (
    <div className="space-y-3">
      <h2 className="font-display text-xl font-bold text-brown-900">Saved Addresses</h2>
      <div className="bg-white rounded-2xl p-5 border border-gold-100 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-khmer-green-50 text-khmer-green-700 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-semibold text-brown-900">Home</span>
              <span className="px-2 py-0.5 bg-gold-100 text-gold-700 text-[10px] font-bold rounded-full">DEFAULT</span>
            </div>
            <p className="text-sm text-brown-600">Phnom Penh, Cambodia</p>
            <p className="text-xs text-brown-400 mt-1">+855 12 345 678</p>
          </div>
        </div>
      </div>
      <button className="w-full py-3 border-2 border-dashed border-gold-200 hover:border-gold-400 text-gold-700 hover:bg-gold-50 rounded-2xl text-sm font-semibold transition-all">
        + Add new address
      </button>
    </div>
  );
}
