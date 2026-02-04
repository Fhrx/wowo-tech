import { Routes, Route } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute"
import RoleRoute from "./RoleRoute"

// ================= PUBLIC =================
import WelcomePage from "../pages/public/WelcomePage"
import LoginPage from "../pages/public/LoginPage"
import RegisterPage from "../pages/public/RegisterPage"

// ================= USER =================
import ProductsPage from "../pages/user/ProductsPage"
import ProductDetailPage from "../pages/user/ProductDetailPage"
import ProfilePage from "../pages/user/ProfilePage"
import CartPage from "../pages/user/CartPage"
import CheckoutPage from "../pages/user/CheckoutPage"
import PaymentPage from "../pages/user/PaymentPage"
import OrderSuccessPage from "../pages/user/OrderSuccesPage"
import OrderHistoryPage from "../pages/user/OrderHistoryPage"
import InvoicePage from "../pages/user/InvoicePage"

// ================= ADMIN =================
import AdminDashboardPage from "../pages/admin/DashboardPage"
import AdminProductsPage from "../pages/admin/ProductsPage"

// ================= OTHER =================
import NotFound from "../pages/NotFound"

// ================= LAYOUT =================
import UserLayout from "../components/layout/UserLayout"
import AdminLayout from "../components/layout/AdminLayout"

export default function AppRouter() {
  return (
    <Routes>
      {/* ========== PUBLIC ========== */}
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ========== USER ========== */}
      <Route element={<ProtectedRoute />}>
        <Route element={<UserLayout />}>
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/invoice/:orderId" element={<InvoicePage />} />
        </Route>
      </Route>

      {/* ========== ADMIN ========== */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowRole={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
          </Route>
        </Route>
      </Route>

      {/* ========== NOT FOUND ========== */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
    