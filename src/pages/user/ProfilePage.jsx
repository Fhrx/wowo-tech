import { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit2, 
  Save, 
  X,
  Shield,
  ShoppingBag,
  Clock,
  Package,
  CreditCard,
  LogOut,
  Camera,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { wowotechToast } from "../../stores/utils/toastConfig.jsx";
import useAuth from "../../stores/hooks/useAuth";

export default function ProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      postalCode: "",
      province: ""
    }
  });
  const [activeTab, setActiveTab] = useState("profile");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  // Stats data
  const [stats] = useState({
    totalOrders: 8,
    totalSpent: 4250000,
    memberSince: "2024-01-15",
    loyaltyPoints: 1250
  });

  // Recent orders
  const [recentOrders] = useState([
    { id: "ORD-001", date: "2024-02-01", total: 1250000, status: "Delivered", items: 3 },
    { id: "ORD-002", date: "2024-01-25", total: 850000, status: "Processing", items: 2 },
    { id: "ORD-003", date: "2024-01-18", total: 2150000, status: "Delivered", items: 5 },
  ]);

  // Initialize form data
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        setFormData({
          fullName: user.fullName || "",
          email: user.email || "",
          phone: user.phone || "",
          address: {
            street: user.address?.street || "",
            city: user.address?.city || "",
            postalCode: user.address?.postalCode || "",
            province: user.address?.province || ""
          }
        });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(formData);
      wowotechToast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch {
      wowotechToast.error("Failed to update profile");
    }
  };

  const handleChangePassword = () => {
    if (passwordData.new !== passwordData.confirm) {
      wowotechToast.error("New passwords don't match!");
      return;
    }
    if (passwordData.new.length < 6) {
      wowotechToast.error("Password must be at least 6 characters");
      return;
    }
    
    wowotechToast.success("Password changed successfully!");
    setIsChangingPassword(false);
    setPasswordData({ current: "", new: "", confirm: "" });
  };

  const handleLogout = () => {
    logout();
    wowotechToast.success("Logged out successfully!");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'processing':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Please Login
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You need to be logged in to view your profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.fullName?.charAt(0).toUpperCase() || "U"}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-gray-800 dark:bg-gray-700 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {user.fullName}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </span>
                  {user.role === 'admin' && (
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs font-medium rounded-full">
                      Administrator
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${isEditing
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                  : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </>
                )}
              </button>
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            {/* Stats Cards */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-500" />
                Account Stats
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
                      <p className="font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                      <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalSpent)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                      <p className="font-bold text-gray-900 dark:text-white">{formatDate(stats.memberSince)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Loyalty Points</p>
                      <p className="font-bold text-gray-900 dark:text-white">{stats.loyaltyPoints} points</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full px-6 py-4 text-left flex items-center gap-3 transition-colors ${activeTab === "profile"
                  ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-l-4 border-red-600"
                  : "hover:bg-gray-50 dark:hover:bg-gray-900/50 text-gray-700 dark:text-gray-300"
                }`}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Profile Information</span>
              </button>
              
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full px-6 py-4 text-left flex items-center gap-3 transition-colors ${activeTab === "security"
                  ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-l-4 border-red-600"
                  : "hover:bg-gray-50 dark:hover:bg-gray-900/50 text-gray-700 dark:text-gray-300"
                }`}
              >
                <Shield className="w-5 h-5" />
                <span className="font-medium">Security</span>
              </button>
              
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full px-6 py-4 text-left flex items-center gap-3 transition-colors ${activeTab === "orders"
                  ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-l-4 border-red-600"
                  : "hover:bg-gray-50 dark:hover:bg-gray-900/50 text-gray-700 dark:text-gray-300"
                }`}
              >
                <Package className="w-5 h-5" />
                <span className="font-medium">Recent Orders</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Profile Information Tab */}
            {activeTab === "profile" && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Personal Information
                  </h2>
                  {isEditing && (
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white"
                        />
                      ) : (
                        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <p className="text-gray-900 dark:text-white">{formData.fullName}</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <p className="text-gray-900 dark:text-white">{formData.email}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white"
                        />
                      ) : (
                        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <p className="text-gray-900 dark:text-white">{formData.phone || "Not set"}</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Account Type
                      </label>
                      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-red-500" />
                          <span className="text-gray-900 dark:text-white capitalize">{user.role}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Shipping Address
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Street Address
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="address.street"
                            value={formData.address.street}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white"
                          />
                        ) : (
                          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <p className="text-gray-900 dark:text-white">{formData.address.street || "Not set"}</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          City
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="address.city"
                            value={formData.address.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white"
                          />
                        ) : (
                          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <p className="text-gray-900 dark:text-white">{formData.address.city || "Not set"}</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Postal Code
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="address.postalCode"
                            value={formData.address.postalCode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white"
                          />
                        ) : (
                          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <p className="text-gray-900 dark:text-white">{formData.address.postalCode || "Not set"}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Security Settings
                </h2>

                <div className="space-y-6">
                  {/* Password Change */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Password</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Change your account password
                        </p>
                      </div>
                      <button
                        onClick={() => setIsChangingPassword(!isChangingPassword)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        {isChangingPassword ? "Cancel" : "Change Password"}
                      </button>
                    </div>

                    {isChangingPassword && (
                      <div className="space-y-4 mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            name="current"
                            value={passwordData.current}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            name="new"
                            value={passwordData.new}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            name="confirm"
                            value={passwordData.confirm}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white"
                          />
                        </div>
                        <button
                          onClick={handleChangePassword}
                          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Update Password
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Security Tips */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                      Security Tips
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Use a strong, unique password that you don't use elsewhere
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Enable two-factor authentication if available
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Never share your password with anyone
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Log out from shared computers
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Orders Tab */}
            {activeTab === "orders" && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Recent Orders
                </h2>

                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-red-500 dark:hover:border-red-600 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{order.id}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(order.date)}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium text-gray-900 dark:text-white">{order.items}</span> items
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Total: <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(order.total)}</span>
                          </div>
                        </div>
                        <button className="px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium text-sm">
                          View Details →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium">
                    View All Orders
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}