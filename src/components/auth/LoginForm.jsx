// src/components/auth/LoginForm.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, quickLoginUsers } from "../../stores/utils/validators";
import { wowotechToast } from "../../stores/utils/toastConfig.jsx";
import toast from "react-hot-toast";
import useAuth from "../../stores/hooks/useAuth";
import { Mail, Lock, User, Eye, EyeOff, Zap, LogIn } from "lucide-react";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

const onSubmit = async (data) => {
  setIsLoading(true);
  try {
    const result = login(data.email, data.password);
    
    if (result.success) {
      wowotechToast.loginSuccess(); // PAKAI INI
      
      if (result.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/products");
      }
    } else {
      wowotechToast.loginError(result.error); // PAKAI INI
    }
  } catch (err) {
    wowotechToast.error(err.message || "Terjadi kesalahan");
  } finally {
    setIsLoading(false);
  }
};

  const handleQuickLogin = (role) => {
    const user = quickLoginUsers[role];
    setValue("email", user.email);
    setValue("password", user.password);
    
    toast.success(`Auto-fill ${role === 'admin' ? 'Admin' : 'User'} credentials`, {
      icon: "⚡",
      duration: 2000,
      style: {
        background: "#1a1a1a",
        color: "#fff",
      },
    });
  };

  return (
    <div className="w-full max-w-md">
      {/* Card Container */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Sign in to your WowoTech account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                {...register("email")}
                type="email"
                placeholder="admin@wowotech.dev"
                className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border ${
                  errors.email 
                    ? "border-red-500 dark:border-red-500" 
                    : "border-gray-300 dark:border-gray-600"
                } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white transition-colors`}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                ⚠️ {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <Link 
                to="/forgot-password" 
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border ${
                  errors.password 
                    ? "border-red-500 dark:border-red-500" 
                    : "border-gray-300 dark:border-gray-600"
                } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white transition-colors`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                ⚠️ {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
          <span className="px-4 text-gray-500 dark:text-gray-400 text-sm">
            Quick Login
          </span>
          <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
        </div>

        {/* Quick Login Buttons */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => handleQuickLogin("admin")}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white font-medium rounded-lg border border-gray-700 dark:border-gray-600 transition-colors flex items-center justify-center gap-3 group disabled:opacity-50"
          >
            <User className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
            <span>Auto-fill Admin Credentials</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin("user")}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg border border-gray-300 dark:border-gray-600 transition-colors flex items-center justify-center gap-3 group disabled:opacity-50"
          >
            <User className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
            <span>Auto-fill User Credentials</span>
          </button>
        </div>

        {/* Register Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-red-600 dark:text-red-400 font-semibold hover:text-red-700 dark:hover:text-red-300 transition-colors underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>

      {/* Security Note */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your credentials are stored securely and never shared. Quick login is for demo purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}