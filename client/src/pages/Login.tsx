import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const loginSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    loading: authLoading,
    error,
    login,
    clearError,
  } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError();
      await login(data.email, data.password);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md">
        <div className="px-6 py-8 border-b border-border">
          <h1 className="text-3xl font-bold text-primary">TutsBank</h1>
          <p className="text-muted-foreground mt-2">Seu banco moderno e seguro</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-destructive text-sm">
                  Erro ao fazer login
                </p>
                <p className="text-destructive/80 text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Email
            </label>
            <Input
              type="email"
              placeholder="seu@email.com"
              {...register("email")}
              disabled={isSubmitting || authLoading}
              className="w-full"
            />
            {formErrors.email && (
              <p className="text-xs text-destructive">
                {formErrors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Senha
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register("password")}
              disabled={isSubmitting || authLoading}
              className="w-full"
            />
            {formErrors.password && (
              <p className="text-xs text-destructive">
                {formErrors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || authLoading}
            className="w-full h-11 font-semibold"
          >
            {isSubmitting || authLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>

          <div className="p-4 bg-secondary rounded-lg">
            <p className="text-xs font-semibold text-foreground mb-2">
              Credenciais de teste:
            </p>
            <p className="text-xs text-muted-foreground">
              <strong>Email:</strong> user@tutsbank.com
            </p>
            <p className="text-xs text-muted-foreground">
              <strong>Senha:</strong> password123
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}