import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../stores/authStore";

export default function ProtectedRoute({ role }) {
  const { isAuthenticated, user } = useAuthStore();

  // belum login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // role tidak sesuai
  if (role && user?.role !== role) {
    return <Navigate to="/notfound" replace />;
  }

  return <Outlet />;
}
