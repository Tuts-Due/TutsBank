import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, AuthState } from "@/types";
import { authService } from "@/services/api";

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ loading: true, error: null });

        try {
          const response = await authService.login({ email, password });

          set({
            isAuthenticated: true,
            user: response.user,
            token: response.token,
            loading: false,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Erro ao fazer login";

          set({
            isAuthenticated: false,
            user: null,
            token: null,
            loading: false,
            error: message,
          });

          throw error;
        }
      },

      logout: async () => {
        set({ loading: true });

        try {
          await authService.logout();

          set({
            isAuthenticated: false,
            user: null,
            token: null,
            loading: false,
            error: null,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Erro ao fazer logout";

          set({
            loading: false,
            error: message,
          });

          throw error;
        }
      },

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: user !== null,
        });
      },

      setToken: (token: string | null) => {
        set({ token });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      restoreSession: async () => {
        set({ loading: true });

        try {
          const user = await authService.getCurrentUser();
          const token = localStorage.getItem("authToken");

          set({
            isAuthenticated: true,
            user,
            token,
            loading: false,
          });
        } catch {
          set({
            isAuthenticated: false,
            user: null,
            token: null,
            loading: false,
          });
        }
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);

export const useUser = () => useAuthStore((state) => state.user);

export const useAuthLoading = () => useAuthStore((state) => state.loading);

export const useAuthError = () => useAuthStore((state) => state.error);

export const useLogin = () => useAuthStore((state) => state.login);
export const useLogout = () => useAuthStore((state) => state.logout);
export const useRestoreSession = () =>
  useAuthStore((state) => state.restoreSession);
export const useClearError = () => useAuthStore((state) => state.clearError);

export const useAuthActions = () => {
  const login = useLogin();
  const logout = useLogout();
  const restoreSession = useRestoreSession();
  const clearError = useClearError();

  return {
    login,
    logout,
    restoreSession,
    clearError,
  };
};