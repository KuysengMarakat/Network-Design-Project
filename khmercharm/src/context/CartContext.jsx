import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { cartAPI } from "../api/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items,      setItems]      = useState([]);
  const [totalUsd,   setTotalUsd]   = useState(0);
  const [totalKhr,   setTotalKhr]   = useState(0);
  const [itemCount,  setItemCount]  = useState(0);
  const [loading,    setLoading]    = useState(false);

  // ── Helper: sync state from API response ──
  const syncCart = useCallback((data) => {
    setItems(data.items      || []);
    setTotalUsd(data.total_usd  || 0);
    setTotalKhr(data.total_khr  || 0);
    setItemCount(data.item_count || 0);
  }, []);

  // ── Fetch cart when user logs in ──
  useEffect(() => {
    if (!user) {
      // Clear cart when logged out
      setItems([]); setTotalUsd(0); setTotalKhr(0); setItemCount(0);
      return;
    }
    setLoading(true);
    cartAPI.get()
      .then((res) => syncCart(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, syncCart]);

  // ── Add to cart ──
  const addToCart = useCallback(async (productId, quantity = 1) => {
    if (!user) return { needsLogin: true };
    const res = await cartAPI.add(productId, quantity);
    syncCart(res.data);
    return res;
  }, [user, syncCart]);

  // ── Update quantity ──
  const updateItem = useCallback(async (cartId, quantity) => {
    const res = await cartAPI.update(cartId, quantity);
    syncCart(res.data);
    return res;
  }, [syncCart]);

  // ── Remove item ──
  const removeItem = useCallback(async (cartId) => {
    const res = await cartAPI.remove(cartId);
    syncCart(res.data);
    return res;
  }, [syncCart]);

  // ── Clear cart ──
  const clearCart = useCallback(async () => {
    const res = await cartAPI.clear();
    syncCart(res.data);
    return res;
  }, [syncCart]);

  return (
    <CartContext.Provider value={{
      items, totalUsd, totalKhr, itemCount, loading,
      addToCart, updateItem, removeItem, clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
