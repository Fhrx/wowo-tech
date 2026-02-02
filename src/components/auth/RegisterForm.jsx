// src/components/auth/RegisterForm.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../stores/utils/validators"; ;
import { wowotechToast } from "../../stores/utils/toastConfig.jsx";
import useAuth from "../../stores/hooks/useAuth";
import { Mail, Lock, User, Eye, EyeOff, Zap, UserPlus, CheckCircle } from "lucide-react";

export default function RegisterForm() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
  setIsLoading(true);
  try {
    const result = await registerUser(data);
    
    if (result.success) {
      wowotechToast.registerSuccess();
      
      // Redirect ke login setelah 2 detik
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      wowotechToast.error(result.error || "Registrasi gagal");
    }
  } catch (err) {
    wowotechToast.error(err.message || "Terjadi kesalahan");
  } finally {
    setIsLoading(false);
  }
};

  // Password requirements
  const passwordRequirements = [
    { label: "Minimum 6 characters", regex: /^.{6,}$/ },
    { label: "At least 1 uppercase letter", regex: /[A-Z]/ },
    { label: "At least 1 number", regex: /[0-9]/ },
  ];

  return (
    <div className="w-full max-w-md">
      {/* Card Container */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create Account
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Join WowoTech community
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                {...register("fullName")}
                type="text"
                placeholder="John Doe"
                className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border ${
                  errors.fullName 
                    ? "border-red-500 dark:border-red-500" 
                    : "border-gray-300 dark:border-gray-600"
                } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white transition-colors`}
                disabled={isLoading}
              />
            </div>
            {errors.fullName && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                ⚠️ {errors.fullName.message}
              </p>
            )}
          </div>

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
                placeholder="john@example.com"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
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
                onChange={(e) => {
                  register("password").onChange(e);
                }}
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
            
            {/* Password Requirements */}
            <div className="mt-3 space-y-2">
              {passwordRequirements.map((req, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
            
            {errors.password && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                ⚠️ {errors.password.message}
              </p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
              required
            />
            <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
              I agree to the{" "}
              <Link to="/terms" className="text-red-600 dark:text-red-400 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-red-600 dark:text-red-400 hover:underline">
                Privacy Policy
              </Link>
            </label>
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
                Creating Account...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-red-600 dark:text-red-400 font-semibold hover:text-red-700 dark:hover:text-red-300 transition-colors underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-red-50 dark:from-gray-900/50 dark:to-red-900/10 rounded-lg border border-gray-200 dark:border-gray-800">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-red-500" />
          Benefits of joining WowoTech
        </h4>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            Access to exclusive deals and discounts
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            Fast checkout with saved details
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            Order tracking and history
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            Priority customer support
          </li>
        </ul>
      </div>
    </div>
  );
}