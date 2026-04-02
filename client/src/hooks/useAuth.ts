/**
 * HOOK DE AUTENTICAÇÃO
 *
 * Encapsula lógica de autenticação combinando Zustand + React Query.
 * Fornece interface simples para login, logout e restauração de sessão.
 *
 * Uso:
 * const { user, isAuthenticated, login, logout } = useAuth();
 */

import { useEffect, useRef } from "react";
import { useAuthStore, useAuthActions } from "@/store/authStore";

export const useAuth = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const { login, logout, restoreSession, clearError } = useAuthActions();
  
  // Usar ref para rastrear se já tentamos restaurar a sessão
  const hasRestoredRef = useRef(false);

  // Restaurar sessão apenas uma vez ao montar o componente
  useEffect(() => {
    if (hasRestoredRef.current) return;
    
    const token = localStorage.getItem("authToken");
    if (token && !isAuthenticated) {
      hasRestoredRef.current = true;
      restoreSession();
    } else {
      hasRestoredRef.current = true;
    }
  }, []); // Dependência vazia - executa apenas uma vez

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
