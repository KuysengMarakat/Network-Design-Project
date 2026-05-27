import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true); // checking stored token on mount

  // ── On mount: restore session from localStorage ──
  useEffect(() => {
    const token = localStorage.getItem("khmercharm_token");
    if (!token) { setLoading(false); return; }

    authAPI.me()
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem("khmercharm_token"))
      .finally(() => setLoading(false));
  }, []);

  // ── Login ──
  const login = useCallback(async (email, password) => {
    const res = await authAPI.login(email, password);
    localStorage.setItem("khmercharm_token", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  // ── Register ──
  const register = useCallback(async (name, email, password) => {
    const res = await authAPI.register(name, email, password);
    localStorage.setItem("khmercharm_token", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  // ── Logout ──
  const logout = useCallback(() => {
    localStorage.removeItem("khmercharm_token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
