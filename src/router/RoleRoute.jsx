import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../stores/hooks/useAuth";

export default function RoleRoute({ allowRole }) {
  const { user, isAuthenticated } = useAuth();

  // ⛔ tunggu auth siap
  if (!isAuthenticated) return null;
  if (!user) return null;

  if (!allowRole.includes(user.role)) {
    return <Navigate to="/notfound" replace />;
  }

  return <Outlet />;
}