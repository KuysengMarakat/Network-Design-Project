import { useState, useEffect } from "react";
import { adminAPI } from "../api/api";
import { Package, ShoppingBag, Users, DollarSign, TrendingUp, AlertTriangle, Clock } from "lucide-react";

const STATUS_COLORS = {
  pending:    "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped:    "bg-purple-100 text-purple-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-700",
};

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="font-display text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard({ onNavigate }) {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    adminAPI.getDashboard()
      .then((res) => setStats(res.data))
      .catch((e)  => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse h-28" />
      ))}
    </div>
  );

  if (error) return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex items-center gap-3">
      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
      <div><p className="font-semibold">Could not load dashboard</p><p className="text-sm">{error}</p></div>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users}       label="Total Users"    value={stats.total_users}    sub="Registered accounts"        color="bg-blue-100 text-blue-600" />
        <StatCard icon={Package}     label="Total Products" value={stats.total_products} sub="In catalogue"               color="bg-gold-100 text-gold-700" />
        <StatCard icon={ShoppingBag} label="Total Orders"   value={stats.total_orders}   sub="All time"                   color="bg-purple-100 text-purple-600" />
        <StatCard icon={DollarSign}  label="Total Revenue"  value={`$${stats.total_revenue_usd?.toFixed(2)}`} sub="Excl. cancelled" color="bg-green-100 text-green-600" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Orders by status */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-gold-600" />
            <h3 className="font-semibold text-gray-900">Orders by Status</h3>
          </div>
          {stats.orders_by_status?.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">No orders yet</p>
          ) : (
            <div className="space-y-2">
              {stats.orders_by_status?.map((s) => (
                <div key={s.status} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[s.status] || "bg-gray-100 text-gray-600"}`}>
                    {s.status}
                  </span>
                  <span className="font-bold text-gray-900">{s.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low stock */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-clay-500" />
            <h3 className="font-semibold text-gray-900">Low Stock Alert</h3>
            <span className="ml-auto text-xs text-gray-400">Stock &lt; 10</span>
          </div>
          {stats.low_stock_products?.length === 0 ? (
            <div className="flex flex-col items-center py-6 text-gray-400">
              <span className="text-3xl mb-2">✅</span>
              <p className="text-sm">All products well stocked</p>
            </div>
          ) : (
            <div className="space-y-2">
              {stats.low_stock_products?.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-700 truncate">{p.name}</span>
                  <span className={`font-bold text-sm ml-2 ${p.stock <= 3 ? "text-red-600" : "text-yellow-600"}`}>
                    {p.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-gold-600" />
          <h3 className="font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Add Product",   emoji: "📦", page: "products" },
            { label: "View Orders",   emoji: "🛒", page: "orders"   },
            { label: "Manage Users",  emoji: "👥", page: "users"    },
            { label: "View Store",    emoji: "🌸", page: "storefront"},
          ].map((a) => (
            <button key={a.label} onClick={() => onNavigate(a.page)}
              className="flex flex-col items-center gap-2 p-4 bg-ivory rounded-xl border border-gold-100 hover:border-gold-300 hover:bg-gold-50 transition-all duration-200 hover:-translate-y-0.5">
              <span className="text-2xl">{a.emoji}</span>
              <span className="text-xs font-semibold text-brown-700">{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
