// ─────────────────────────────────────────────
//  KhmerCharm — Central API helper
//  All fetch calls go through here so the token
//  and base URL are always handled consistently.
// ─────────────────────────────────────────────
import { API_BASE } from "./config";

function getToken() {
  return localStorage.getItem("khmercharm_token") || null;
}

async function request(method, path, body = null, useAuth = true) {
  const headers = { "Content-Type": "application/json" };
  if (useAuth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${path}`, opts);
  const data = await res.json();

  if (!res.ok && !data.success) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

// ── Auth ──────────────────────────────────────
export const authAPI = {
  login:    (email, password) => request("POST", "/auth/login",    { email, password }, false),
  register: (name, email, password) => request("POST", "/auth/register", { name, email, password }, false),
  me:       ()                => request("GET",  "/auth/me"),
};

// ── Products ──────────────────────────────────
export const productsAPI = {
  getAll:   (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request("GET", `/products${qs ? "?" + qs : ""}`, null, false);
  },
  getOne:   (id)          => request("GET",    `/products/${id}`, null, false),
  search:   (keyword)     => request("GET",    `/products/secure-search?keyword=${encodeURIComponent(keyword)}`, null, false),
};

// ── Cart ──────────────────────────────────────
export const cartAPI = {
  get:      ()                        => request("GET",    "/cart"),
  add:      (product_id, quantity=1)  => request("POST",   "/cart",       { product_id, quantity }),
  update:   (cartId, quantity)        => request("PUT",    `/cart/${cartId}`, { quantity }),
  remove:   (cartId)                  => request("DELETE", `/cart/${cartId}`),
  clear:    ()                        => request("DELETE", "/cart"),
};

// ── Orders ────────────────────────────────────
export const ordersAPI = {
  create:   (shipping_address, phone) => request("POST", "/orders", { shipping_address, phone }),
  getAll:   ()                        => request("GET",  "/orders"),
  getOne:   (id)                      => request("GET",  `/orders/${id}`),
};

// ── Admin ─────────────────────────────────────
export const adminAPI = {
  getDashboard:      ()              => request("GET",  "/admin/dashboard"),
  getUsers:          ()              => request("GET",  "/admin/users"),
  getOrders:         ()              => request("GET",  "/admin/orders"),
  updateOrderStatus: (id, status)    => request("PUT",  `/admin/orders/${id}/status`, { status }),
  createProduct:     (data)          => request("POST", "/products", data),
  updateProduct:     (id, data)      => request("PUT",  `/products/${id}`, data),
  deleteProduct:     (id)            => request("DELETE", `/products/${id}`),
};
