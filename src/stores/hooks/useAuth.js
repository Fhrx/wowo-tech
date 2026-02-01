import useAuthStore from "../authStore";

export default function useAuth() {
  const {
    user,
    isAuthenticated,
    login,
    logout,
    register,
  } = useAuthStore();

  return {
    user,
    isAuthenticated,
    login,
    logout,
    register,
    isAdmin: user?.role === "admin",
  };
}
