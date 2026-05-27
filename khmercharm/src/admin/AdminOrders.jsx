import { useState, useEffect } from "react";
import { adminAPI } from "../api/api";
import { ShoppingBag, ChevronDown, AlertTriangle, RefreshCw } from "lucide-react";

const STATUSES = ["pending","processing","shipped","delivered","cancelled"];

const STATUS_STYLE = {
  pending:    "bg-yellow-100 text-yellow-700 border-yellow-200",
  processing: "bg-blue-100 text-blue-700 border-blue-200",
  shipped:    "bg-purple-100 text-purple-700 border-purple-200",
  delivered:  "bg-green-100 text-green-700 border-green-200",
  cancelled:  "bg-red-100 text-red-700 border-red-200",
};

const STATUS_NEXT = {
  pending:    ["processing", "cancelled"],
  processing: ["shipped",    "cancelled"],
  shipped:    ["delivered",  "cancelled"],
  delivered:  [],
  cancelled:  [],
};

function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${STATUS_STYLE[status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {status}
    </span>
  );
}

export default function AdminOrders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [filter,  setFilter]  = useState("all");
  const [updating,setUpdating]= useState(null); // order id being updated
  const [expanded,setExpanded]= useState(null); // expanded order id

  const load = () => {
    setLoading(true);
    adminAPI.getOrders()
      .then((r) => setOrders(r.data.orders || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await adminAPI.updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    } catch (e) { alert(e.message); }
    finally { setUpdating(null); }
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const countOf = (s) => orders.filter((o) => o.status === s).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-gray-900">Orders</h2>
          <p className="text-sm text-gray-500 mt-0.5">{orders.length} total orders</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {["all", ...STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border capitalize transition-all ${
              filter === s ? "bg-brown-800 text-white border-brown-800" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}>
            {s === "all" ? `All (${orders.length})` : `${s} (${countOf(s)})`}
          </button>
        ))}
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex gap-2"><AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />{error}</div>}

      {/* Orders list */}
      <div className="space-y-3">
        {loading ? (
          [...Array(5)].map((_, i) => <div key={i} className="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse" />)
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-400">
            <ShoppingBag className="w-10 h-10 mb-3 opacity-30" />
            <p className="font-semibold">No orders found</p>
          </div>
        ) : (
          filtered.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Order header */}
              <div className="flex flex-wrap items-center gap-3 px-4 py-4">
                <div className="font-mono text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">#{order.id}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{order.customer_name || "Customer"}</p>
                  <p className="text-xs text-gray-400">{order.customer_email} · {new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${order.total_usd?.toFixed(2)}</p>
                  <p className="text-xs text-gray-400">{order.total_khr?.toLocaleString()}៛</p>
                </div>
                <StatusBadge status={order.status} />

                {/* Status update dropdown */}
                {STATUS_NEXT[order.status]?.length > 0 && (
                  <div className="relative">
                    <select
                      disabled={updating === order.id}
                      onChange={(e) => e.target.value && updateStatus(order.id, e.target.value)}
                      value=""
                      className="appearance-none pl-3 pr-7 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 bg-white hover:border-gold-300 cursor-pointer focus:outline-none disabled:opacity-50"
                    >
                      <option value="">Update…</option>
                      {STATUS_NEXT[order.status].map((s) => (
                        <option key={s} value={s} className="capitalize">{s}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                  </div>
                )}

                {/* Expand toggle */}
                <button
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${expanded === order.id ? "rotate-180" : ""}`} />
                </button>
              </div>

              {/* Expanded items */}
              {expanded === order.id && order.items && (
                <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Order Items</p>
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{item.product_name || item.name}</span>
                      <div className="flex items-center gap-3 text-gray-500">
                        <span>×{item.quantity}</span>
                        <span className="font-semibold text-gray-900">${(item.price_usd * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                  {order.shipping_address && (
                    <p className="text-xs text-gray-400 pt-2 border-t border-gray-200">📍 {order.shipping_address} {order.phone && `· ${order.phone}`}</p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
