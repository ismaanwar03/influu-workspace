"use client";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { ROUTES } from "@/lib/constants";
import toast from "react-hot-toast";

export function useAuth() {
  const { user, isAuthenticated, setAuth, logout } = useAuthStore();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      const res = await authApi.login({ email, password });
      const { user: u, tokens } = res.data.data as { user: never; tokens: { accessToken: string; refreshToken: string } };
      setAuth(u, tokens);

      // Redirect based on role
      const role = (u as { role: string }).role;
      if (role === "brand")   router.push(ROUTES.brand.dashboard);
      if (role === "creator") router.push(ROUTES.creator.dashboard);

      toast.success("Welcome back!");
    } catch {
      toast.error("Invalid email or password");
      throw new Error("Login failed");
    }
  };

  const signout = () => {
    logout();
    router.push(ROUTES.login);
    toast.success("Signed out successfully");
  };

  const requireAuth = (redirectTo?: string) => {
    if (!isAuthenticated) {
      router.push(redirectTo ?? ROUTES.login);
      return false;
    }
    return true;
  };

  return { user, isAuthenticated, login, signout, requireAuth };
}
