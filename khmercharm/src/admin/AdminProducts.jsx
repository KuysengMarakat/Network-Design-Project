import { useState, useEffect } from "react";
import { adminAPI, productsAPI } from "../api/api";
import { Plus, Pencil, Trash2, X, Save, AlertTriangle, Package } from "lucide-react";

const EMPTY_FORM = {
  name: "", description: "", category: "", price_usd: "",
  price_khr: "", stock: "", tag: "", rating: "5",
};
const CATEGORIES = ["Bracelets","Necklaces","Rings","Hair Accessories","Bags","Phone Charms"];
const TAGS       = ["", "New", "Popular", "Sale"];

function Modal({ title, onClose, onSave, saving, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="h-1 bg-gradient-to-r from-clay-400 via-gold-400 to-khmer-green-500 rounded-t-2xl" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-display font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
        </div>
        <div className="px-6 py-4 space-y-4">{children}</div>
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={onSave} disabled={saving}
            className="flex-1 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-xl text-sm font-semibold hover:from-gold-400 hover:to-gold-500 disabled:opacity-60 transition-all flex items-center justify-center gap-2">
            <Save className="w-4 h-4" />{saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

const inp = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-gold-400 focus:outline-none transition-colors bg-gray-50 focus:bg-white";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [modal,    setModal]    = useState(null); // null | "add" | "edit"
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [editId,   setEditId]   = useState(null);
  const [saving,   setSaving]   = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search,   setSearch]   = useState("");

  const load = () => {
    setLoading(true);
    productsAPI.getAll({})
      .then((r) => setProducts(r.data.products || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openAdd  = () => { setForm(EMPTY_FORM); setEditId(null); setModal("add"); };
  const openEdit = (p) => {
    setForm({
      name: p.name, description: p.description || "", category: p.category,
      price_usd: p.price_usd, price_khr: p.price_khr, stock: p.stock,
      tag: p.tag || "", rating: p.rating,
    });
    setEditId(p.id); setModal("edit");
  };

  const handleSave = async () => {
    if (!form.name || !form.category || !form.price_usd) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        price_usd: parseFloat(form.price_usd),
        price_khr: parseInt(form.price_khr) || Math.round(parseFloat(form.price_usd) * 4000),
        stock:     parseInt(form.stock) || 0,
        rating:    parseFloat(form.rating) || 5,
        tag:       form.tag || null,
      };
      if (modal === "add") await adminAPI.createProduct(payload);
      else                 await adminAPI.updateProduct(editId, payload);
      setModal(null); load();
    } catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await adminAPI.deleteProduct(id); load(); }
    catch (e) { alert(e.message); }
    finally { setDeleteId(null); }
  };

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const TAG_STYLE = {
    New: "bg-green-100 text-green-700", Popular: "bg-gold-100 text-gold-700",
    Sale: "bg-red-100 text-red-700",    "": "bg-gray-100 text-gray-500",
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500 mt-0.5">{products.length} total products</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…" className={`${inp} flex-1 sm:w-56`} />
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white text-sm font-semibold rounded-xl shadow-sm transition-all whitespace-nowrap">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex gap-2"><AlertTriangle className="w-4 h-4 mt-0.5" />{error}</div>}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="space-y-px">
            {[...Array(6)].map((_, i) => <div key={i} className="h-16 bg-gray-50 animate-pulse border-b border-gray-100 last:border-0" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <Package className="w-10 h-10 mb-3 opacity-30" />
            <p className="font-semibold">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["ID","Name","Category","Price","Stock","Tag","Rating","Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-0">
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">#{p.id}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900 max-w-[180px] truncate">{p.name}</td>
                    <td className="px-4 py-3 text-gray-500">{p.category}</td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-gray-900">${p.price_usd}</span>
                      <span className="text-gray-400 text-xs ml-1">{p.price_khr?.toLocaleString()}៛</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${p.stock <= 5 ? "text-red-600" : p.stock <= 15 ? "text-yellow-600" : "text-green-600"}`}>{p.stock}</span>
                    </td>
                    <td className="px-4 py-3">
                      {p.tag ? <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${TAG_STYLE[p.tag] || TAG_STYLE[""]}`}>{p.tag}</span> : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-yellow-500 font-semibold">{"⭐".repeat(Math.round(p.rating))}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <Modal title={modal === "add" ? "Add New Product" : "Edit Product"} onClose={() => setModal(null)} onSave={handleSave} saving={saving}>
          <Field label="Product Name *"><input className={inp} value={form.name} onChange={f("name")} placeholder="e.g. Golden Lotus Bracelet" /></Field>
          <Field label="Description"><textarea className={`${inp} resize-none`} rows={3} value={form.description} onChange={f("description")} placeholder="Short description…" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category *">
              <select className={inp} value={form.category} onChange={f("category")}>
                <option value="">Select…</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Tag">
              <select className={inp} value={form.tag} onChange={f("tag")}>
                {TAGS.map((t) => <option key={t} value={t}>{t || "None"}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price USD *"><input className={inp} type="number" step="0.01" value={form.price_usd} onChange={f("price_usd")} placeholder="0.00" /></Field>
            <Field label="Price KHR"><input className={inp} type="number" value={form.price_khr} onChange={f("price_khr")} placeholder="Auto-calculate" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Stock"><input className={inp} type="number" value={form.stock} onChange={f("stock")} placeholder="0" /></Field>
            <Field label="Rating (1–5)"><input className={inp} type="number" min="1" max="5" step="0.5" value={form.rating} onChange={f("rating")} /></Field>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center space-y-4">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto"><Trash2 className="w-6 h-6 text-red-500" /></div>
            <h3 className="font-display font-bold text-gray-900">Delete Product?</h3>
            <p className="text-sm text-gray-500">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
