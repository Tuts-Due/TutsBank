/**
 * PÁGINA DE PERFIL
 *
 * Permite ao usuário:
 * - Visualizar informações pessoais
 * - Alterar nome, email, telefone
 * - Alterar senha
 * - Validação com Zod
 * - Feedback visual com toast
 *
 * Padrão: Neo-Banking Minimalist
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// Schema para informações pessoais
const personalInfoSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome não pode ter mais de 100 caracteres"),
  email: z
    .string()
    .email("Email inválido"),
  phone: z
    .string()
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "Telefone inválido. Formato: (11) 9999-9999"),
});

// Schema para alteração de senha
const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Senha atual é obrigatória"),
    newPassword: z
      .string()
      .min(6, "Nova senha deve ter pelo menos 6 caracteres")
      .min(1, "Nova senha é obrigatória"),
    confirmPassword: z
      .string()
      .min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não correspondem",
    path: ["confirmPassword"],
  });

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function Profile() {
  const { user } = useAuth();
  const [isLoadingPersonal, setIsLoadingPersonal] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form para informações pessoais
  const {
    register: registerPersonal,
    handleSubmit: handleSubmitPersonal,
    formState: { errors: errorsPersonal },
    reset: resetPersonal,
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "(11) 9999-9999",
    },
  });

  // Form para senha
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Simular atualização de informações pessoais
  const onSubmitPersonal = async (data: PersonalInfoFormData) => {
    setIsLoadingPersonal(true);
    try {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Validar senha atual (mock)
      if (data.email !== user?.email) {
        // Simular validação
        toast.success("Informações pessoais atualizadas com sucesso!", {
          description: `Nome: ${data.name}, Email: ${data.email}`,
        });
      } else {
        toast.success("Informações pessoais atualizadas com sucesso!");
      }

      resetPersonal();
    } catch (error) {
      toast.error("Erro ao atualizar informações", {
        description: "Tente novamente mais tarde",
      });
    } finally {
      setIsLoadingPersonal(false);
    }
  };

  // Simular alteração de senha
  const onSubmitPassword = async (data: PasswordFormData) => {
    setIsLoadingPassword(true);
    try {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Validar senha atual (mock - aceita qualquer coisa)
      if (data.currentPassword === "password123") {
        toast.success("Senha alterada com sucesso!", {
          description: "Sua nova senha foi definida",
        });
        resetPassword();
      } else {
        toast.error("Senha atual incorreta", {
          description: "Verifique e tente novamente",
        });
      }
    } catch (error) {
      toast.error("Erro ao alterar senha", {
        description: "Tente novamente mais tarde",
      });
    } finally {
      setIsLoadingPassword(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  return (
    <Layout>
      <div className="space-y-8 animate-fadeInUp">
        {/* Header */}
        <div className="animate-fadeInDown">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Meu Perfil
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Gerencie suas informações pessoais e segurança
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Informações do Usuário */}
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 h-fit animate-scaleIn">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-primary/30 flex items-center justify-center text-2xl font-bold text-primary">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-semibold text-foreground">{user?.name}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold text-foreground truncate">{user?.email}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Conta</p>
                <p className="font-semibold text-foreground">{user?.accountNumber}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">CPF</p>
                <p className="font-semibold text-foreground">
                  {user?.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.***.***.***")}
                </p>
              </div>

              <div className="pt-4 border-t border-primary/20">
                <p className="text-xs text-muted-foreground">Membro desde</p>
                <p className="font-semibold text-foreground">
                  {new Date(user?.createdAt || "").toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Formulário de Informações Pessoais */}
            <Card className="p-6 hover:shadow-lg transition-all duration-300 animate-slideInLeft">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Informações Pessoais
              </h2>

              <form
                onSubmit={handleSubmitPersonal(onSubmitPersonal)}
                className="space-y-4"
              >
                {/* Nome */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Nome Completo
                  </label>
                  <Input
                    type="text"
                    placeholder="Seu nome completo"
                    {...registerPersonal("name")}
                    disabled={isLoadingPersonal}
                    className="transition-all duration-200"
                  />
                  {errorsPersonal.name && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errorsPersonal.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    {...registerPersonal("email")}
                    disabled={isLoadingPersonal}
                    className="transition-all duration-200"
                  />
                  {errorsPersonal.email && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errorsPersonal.email.message}
                    </p>
                  )}
                </div>

                {/* Telefone */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Telefone
                  </label>
                  <Input
                    type="tel"
                    placeholder="(11) 9999-9999"
                    {...registerPersonal("phone")}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value);
                      e.target.value = formatted;
                      registerPersonal("phone").onChange(e);
                    }}
                    disabled={isLoadingPersonal}
                    className="transition-all duration-200"
                  />
                  {errorsPersonal.phone && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errorsPersonal.phone.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoadingPersonal}
                  className="w-full transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  {isLoadingPersonal ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Atualizando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </form>
            </Card>

            {/* Formulário de Alteração de Senha */}
            <Card className="p-6 border-destructive/20 hover:shadow-lg transition-all duration-300 animate-slideInLeft">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Alterar Senha
              </h2>

              <form
                onSubmit={handleSubmitPassword(onSubmitPassword)}
                className="space-y-4"
              >
                {/* Senha Atual */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Senha Atual
                  </label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...registerPassword("currentPassword")}
                      disabled={isLoadingPassword}
                      className="pr-10 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errorsPassword.currentPassword && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errorsPassword.currentPassword.message}
                    </p>
                  )}
                </div>

                {/* Nova Senha */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Nova Senha
                  </label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...registerPassword("newPassword")}
                      disabled={isLoadingPassword}
                      className="pr-10 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errorsPassword.newPassword && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errorsPassword.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirmar Senha */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Confirmar Nova Senha
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...registerPassword("confirmPassword")}
                      disabled={isLoadingPassword}
                      className="pr-10 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errorsPassword.confirmPassword && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errorsPassword.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Dica de Segurança */}
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-xs text-yellow-700 dark:text-yellow-400">
                    💡 Use uma senha forte com letras, números e caracteres especiais
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoadingPassword}
                  className="w-full transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  {isLoadingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Alterando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Alterar Senha
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
