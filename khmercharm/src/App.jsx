import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider }     from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ToastProvider }    from "./context/ToastContext";

import ScrollToTop from "./components/ScrollToTop";
import Navbar      from "./components/Navbar";
import Footer      from "./components/Footer";

// Storefront pages
import HomePage          from "./pages/HomePage";
import ShopPage          from "./pages/ShopPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage          from "./pages/CartPage";
import CheckoutPage      from "./pages/CheckoutPage";
import LoginPage         from "./pages/LoginPage";
import RegisterPage      from "./pages/RegisterPage";
import AccountPage       from "./pages/AccountPage";
import WishlistPage      from "./pages/WishlistPage";
import CollectionsPage   from "./pages/CollectionsPage";
import AboutPage         from "./pages/AboutPage";
import ContactPage       from "./pages/ContactPage";
import NotFoundPage      from "./pages/NotFoundPage";

// Admin
import AdminLayout    from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProducts  from "./admin/AdminProducts";
import AdminOrders    from "./admin/AdminOrders";
import AdminUsers     from "./admin/AdminUsers";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ScrollToTop />
              <AppShell />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

// ── Layout shell — decides whether to show Navbar/Footer ──
function AppShell() {
  const location = useLocation();
  const isAuthPage  = ["/login", "/register"].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-ivory font-body flex flex-col">
      {!isAuthPage && !isAdminPage && <Navbar />}

      <main className={`flex-1 ${!isAuthPage && !isAdminPage ? "pt-16" : ""}`}>
        <Routes>
          {/* Public routes */}
          <Route path="/"            element={<HomePage />} />
          <Route path="/shop"        element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart"        element={<CartPage />} />
          <Route path="/checkout"    element={<CheckoutPage />} />
          <Route path="/login"       element={<LoginPage />} />
          <Route path="/register"    element={<RegisterPage />} />
          <Route path="/wishlist"    element={<WishlistPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/about"       element={<AboutPage />} />
          <Route path="/contact"     element={<ContactPage />} />

          {/* Account — requires login */}
          <Route path="/account" element={<RequireAuth><AccountPage /></RequireAuth>} />

          {/* Admin — requires admin role */}
          <Route path="/admin/*" element={<RequireAdmin><AdminRouter /></RequireAdmin>} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {!isAuthPage && !isAdminPage && <Footer />}
    </div>
  );
}

// ── Admin nested routing inside AdminLayout ──
function AdminRouter() {
  return (
    <Routes>
      <Route path="/"           element={<AdminPageWrap page="dashboard" />} />
      <Route path="/products"   element={<AdminPageWrap page="products"  />} />
      <Route path="/orders"     element={<AdminPageWrap page="orders"    />} />
      <Route path="/customers"  element={<AdminPageWrap page="users"     />} />
      <Route path="/users"      element={<AdminPageWrap page="users"     />} />
      <Route path="/settings"   element={<AdminPageWrap page="settings"  />} />
      <Route path="*"           element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

import { useNavigate } from "react-router-dom";

function AdminPageWrap({ page }) {
  const navigate = useNavigate();
  const handleNav = (p) => {
    const path = p === "storefront" ? "/"
               : p === "dashboard"  ? "/admin"
               : p === "users"      ? "/admin/customers"
               :                      `/admin/${p}`;
    navigate(path);
  };
  return (
    <AdminLayout page={page}>
      {page === "dashboard" && <AdminDashboard onNavigate={handleNav} />}
      {page === "products"  && <AdminProducts />}
      {page === "orders"    && <AdminOrders />}
      {page === "users"     && <AdminUsers />}
      {page === "settings"  && (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center text-gray-500">
          Settings page (coming soon)
        </div>
      )}
    </AdminLayout>
  );
}

// ── Route guards ──
function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!user) return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  return children;
}

function RequireAdmin({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login?redirect=/admin" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}
