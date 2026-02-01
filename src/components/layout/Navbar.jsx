import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../stores/hooks/useAuth";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logout berhasil");
    navigate("/login");
  };

  return (
    <div className="navbar bg-base-100 shadow px-6">
      {/* LOGO */}
      <div className="flex-1">
        <Link to="/" className="text-xl font-bold">
          Wowo<span className="text-primary">Tech</span>
        </Link>
      </div>

      {/* MENU */}
      <div className="flex gap-4 items-center">
        {!isAuthenticated && (
          <>
            <Link to="/login" className="btn btn-ghost">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
          </>
        )}

        {isAuthenticated && user?.role === "user" && (
          <>
            <Link to="/products" className="btn btn-ghost">
              Products
            </Link>
            <Link to="/cart" className="btn btn-ghost">
              Cart
            </Link>
            <Link to="/orders" className="btn btn-ghost">
              Orders
            </Link>
            <Link to="/profile" className="btn btn-ghost">
              Profile
            </Link>
          </>
        )}

        {isAuthenticated && user?.role === "admin" && (
          <>
            <Link to="/admin" className="btn btn-ghost">
              Dashboard
            </Link>
            <Link to="/admin/products" className="btn btn-ghost">
              Products
            </Link>
          </>
        )}

        {isAuthenticated && (
          <>
            <span className="badge badge-outline capitalize">
              {user.role}
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-error btn-sm"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}