import { useEffect, useRef } from "react";
import { useAuthStore, useAuthActions } from "@/store/authStore";

export const useAuth = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const { login, logout, restoreSession, clearError } = useAuthActions();

  const hasRestoredRef = useRef(false);

  useEffect(() => {
    if (hasRestoredRef.current) return;

    const token = localStorage.getItem("authToken");

    if (token && !isAuthenticated) {
      hasRestoredRef.current = true;
      restoreSession();
    } else {
      hasRestoredRef.current = true;
    }
  }, []);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    clearError,
  };
};