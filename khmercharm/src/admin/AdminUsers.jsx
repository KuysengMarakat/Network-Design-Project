import { useState, useEffect } from "react";
import { adminAPI } from "../api/api";
import { Users, Shield, User, AlertTriangle, RefreshCw, Search } from "lucide-react";

export default function AdminUsers() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("all");

  const load = () => {
    setLoading(true);
    adminAPI.getUsers()
      .then((r) => setUsers(r.data.users || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole   = filter === "all" || u.role === filter;
    return matchSearch && matchRole;
  });

  const countOf = (role) => users.filter((u) => u.role === role).length;

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-gray-900">Users</h2>
          <p className="text-sm text-gray-500 mt-0.5">{users.length} registered accounts</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Users",   value: users.length,     icon: Users,  color: "bg-blue-50 text-blue-600"  },
          { label: "Admins",        value: countOf("admin"),  icon: Shield, color: "bg-clay-50 text-clay-600"  },
          { label: "Customers",     value: countOf("customer"),icon: User,  color: "bg-gold-50 text-gold-700"  },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
              <s.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-gold-400 focus:outline-none bg-gray-50 focus:bg-white transition-colors" />
        </div>
        <div className="flex gap-2">
          {["all","admin","customer"].map((r) => (
            <button key={r} onClick={() => setFilter(r)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold border capitalize transition-all ${
                filter === r ? "bg-brown-800 text-white border-brown-800" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />{error}
        </div>
      )}

      {/* Users table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="space-y-px">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-50 animate-pulse border-b border-gray-100 last:border-0" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <Users className="w-10 h-10 mb-3 opacity-30" />
            <p className="font-semibold">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["ID","Name","Email","Role","Joined"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-0">
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">#{u.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                          u.role === "admin" ? "bg-gradient-to-br from-clay-400 to-clay-600" : "bg-gradient-to-br from-gold-400 to-gold-600"
                        }`}>
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${
                        u.role === "admin"
                          ? "bg-clay-50 text-clay-700 border-clay-200"
                          : "bg-gold-50 text-gold-700 border-gold-200"
                      }`}>
                        {u.role === "admin" ? "🛡️ Admin" : "👤 Customer"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Security note */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex gap-2">
        <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">Security Note — Educational Demo</p>
          <p className="mt-0.5 text-amber-700">
            Passwords are never shown here (secure endpoint). Compare with{" "}
            <code className="bg-amber-100 px-1 rounded">/api/admin/demo-users</code>{" "}
            to see the broken access control vulnerability demo.
          </p>
        </div>
      </div>
    </div>
  );
}
