// src/components/layout/Navbar.jsx - UPDATE BAGIAN THEME
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Sun,
  Moon,
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  Home,
  Package,
  Settings,
  LogOut,
  Zap
} from "lucide-react";
import useAuth from "../../stores/hooks/useAuth";
import useTheme from "../../stores/hooks/useTheme"; // ← IMPORT BARU
import { wowotechToast } from "../../stores/utils/toastConfig.jsx";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme(); // ← PAKAI useTheme HOOK
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // HAPUS useEffect yang lama!

  const handleThemeToggle = () => {
    toggleTheme();

    // Toast notification
    if (!isDarkMode) {
      wowotechToast.info("Dark mode diaktifkan", {
        icon: <Moon className="w-5 h-5 text-blue-500" />
      });
    } else {
      wowotechToast.info("Light mode diaktifkan", {
        icon: <Sun className="w-5 h-5 text-yellow-500" />
      });
    }
  };

  const handleLogout = () => {
    logout();
    wowotechToast.success("Logout berhasil");
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { path: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
    { path: "/products", label: "Products", icon: <Package className="w-4 h-4" /> },
    ...(isAdmin ? [
      { path: "/admin", label: "Dashboard", icon: <Settings className="w-4 h-4" /> },
      { path: "/admin/products", label: "Manage Products", icon: <Package className="w-4 h-4" /> },
    ] : []),
  ];

  const userLinks = [
    { path: "/profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    { path: "/cart", label: "Cart", icon: <ShoppingCart className="w-4 h-4" /> },
    { path: "/orders", label: "Orders", icon: <Package className="w-4 h-4" /> },
  ];

  return (
    <>
        <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-md">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 mr-2"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 flex items-center justify-center">
                  <img
                    src="/wowotechb.svg"
                    alt="WowoTech Logo"
                    className="w-full h-full object-contain dark:hidden"
                  />
                  <img
                    src="/wowotechw.svg"
                    alt="WowoTech Logo"
                    className="w-full h-full object-contain hidden dark:block"
                  />
                </div>
                <div className="hidden md:block">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    <span className="text-red-600">Wowo</span>Tech
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Premium Tech Components</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.path
                      ? "bg-red-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle Button */}
              <button
                onClick={handleThemeToggle} // ← PAKAI handleThemeToggle
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500 group-hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700 group-hover:rotate-12 transition-transform" />
                )}
              </button>

              {/* Cart Icon */}
              <Link
                to="/cart"
                className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 relative"
              >
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user?.fullName?.split(" ")[0] || "User"}
                    </span>
                    {isAdmin && (
                      <span className="hidden md:inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                        Admin
                      </span>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <p className="font-medium text-gray-900 dark:text-white">{user?.fullName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                      {isAdmin && (
                        <span className="inline-flex items-center px-2 py-1 mt-2 rounded-full text-xs font-medium bg-red-600 text-white">
                          Administrator
                        </span>
                      )}
                    </div>
                    <div className="p-2">
                      {userLinks.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {link.icon}
                          {link.label}
                        </Link>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 mt-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden mt-4 pb-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari produk..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium ${location.pathname === link.path
                      ? "bg-red-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}

              {isAuthenticated && (
                <>
                  <div className="border-t border-gray-200 dark:border-gray-800 my-2 pt-2">
                    <p className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">ACCOUNT</p>
                    {userLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        {link.icon}
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Theme Status Indicator */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-full shadow-lg transition-all duration-300 ${isDarkMode
            ? "bg-gray-900 text-gray-300 border border-gray-800"
            : "bg-white text-gray-700 border border-gray-200"
          }`}>
          {isDarkMode ? (
            <>
              <Moon className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-medium">Dark Mode</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-medium">Light Mode</span>
            </>
          )}
        </div>
      </div>
    </>
  );
}