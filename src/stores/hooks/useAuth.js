// src/stores/hooks/useAuth.js
import { useAuthStore } from '../authStore';

export default function useAuth() {
  const {
    user,
    isAuthenticated,
    login,
    logout,
    register,
    quickLogin
  } = useAuthStore();

  return {
    user,
    isAuthenticated,
    login,
    logout,
    register,
    quickLogin,
    isAdmin: user?.role === "admin",
  };
}