/**
 * PRIVATE ROUTE
 *
 * Componente que protege rotas que exigem autenticação.
 * Se o usuário não estiver autenticado, é redirecionado para /login.
 *
 * Uso:
 * <PrivateRoute>
 *   <Dashboard />
 * </PrivateRoute>
 */

import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  // Enquanto carrega, mostrar spinner
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="w-12 h-12 text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não autenticado, redirecionar para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se autenticado, renderizar o componente
  return <>{children}</>;
}
