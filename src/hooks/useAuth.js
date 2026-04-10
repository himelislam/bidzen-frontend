// All components read auth through this hook — never import useAuthStore directly
import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const { token, user, setAuth, logout } = useAuthStore();
  const isAuthenticated = !!token;
  const isBuyer = user?.role === "buyer";
  const isSeller = user?.role === "seller";
  const isAdmin = user?.role === "admin";

  return { token, user, setAuth, logout, isAuthenticated, isBuyer, isSeller, isAdmin };
}
