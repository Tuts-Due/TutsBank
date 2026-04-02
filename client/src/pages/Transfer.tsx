import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useTransfer, useGetBalance } from "@/hooks/useQueries";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";

const transferSchema = z.object({
  recipientAccount: z
    .string()
    .min(1, "Conta do destinatário é obrigatória")
    .regex(/^\d{4}-\d$/, "Formato: 1234-5"),
  recipientName: z
    .string()
    .min(1, "Nome do destinatário é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres"),
  amount: z
    .string()
    .min(1, "Valor é obrigatório")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Valor deve ser maior que zero",
    }),
  description: z
    .string()
    .max(100, "Descrição não pode ter mais de 100 caracteres"),
});

type TransferFormData = z.infer<typeof transferSchema>;

export default function Transfer() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mutate: transfer, isPending } = useTransfer();
  const { data: balance } = useGetBalance(user?.id || null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      recipientAccount: "",
      recipientName: "",
      amount: "",
      description: "",
    },
  });

  const amount = watch("amount");
  const amountValue = amount ? parseFloat(amount) : 0;
  const hasInsufficientBalance = amountValue > (balance || 0);

  const onSubmit = async (data: TransferFormData) => {
    if (!user) return;

    transfer(
      {
        userId: user.id,
        payload: {
          recipientAccount: data.recipientAccount,
          recipientName: data.recipientName,
          amount: parseFloat(data.amount),
          description: data.description,
        },
      },
      {
        onSuccess: (response) => {
          setSuccess(true);
          setSuccessMessage(response.message);
          reset();
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        },
      }
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Transferência</h1>
          <p className="text-muted-foreground mt-2">
            Envie dinheiro para outra conta
          </p>
        </div>

        <Card className="p-8">
          {success ? (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Transferência realizada!
                </h2>
                <p className="text-muted-foreground mt-2">{successMessage}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Redirecionando para o dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">Saldo disponível</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(balance || 0)}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Conta do destinatário
                </label>
                <Input
                  placeholder="1234-5"
                  {...register("recipientAccount")}
                  disabled={isSubmitting || isPending}
                />
                {errors.recipientAccount && (
                  <p className="text-xs text-destructive">
                    {errors.recipientAccount.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Nome do destinatário
                </label>
                <Input
                  placeholder="Arthur Dué"
                  {...register("recipientName")}
                  disabled={isSubmitting || isPending}
                />
                {errors.recipientName && (
                  <p className="text-xs text-destructive">
                    {errors.recipientName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Valor
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("amount")}
                  disabled={isSubmitting || isPending}
                />
                {errors.amount && (
                  <p className="text-xs text-destructive">
                    {errors.amount.message}
                  </p>
                )}
                {hasInsufficientBalance && (
                  <p className="text-xs text-destructive">
                    Saldo insuficiente
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Descrição
                </label>
                <Input
                  placeholder="Motivo da transferência"
                  {...register("description")}
                  disabled={isSubmitting || isPending}
                />
                {errors.description && (
                  <p className="text-xs text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {amountValue > 0 && (
                <div className="p-4 bg-secondary rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor:</span>
                    <span className="font-semibold">
                      {formatCurrency(amountValue)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saldo após:</span>
                    <span
                      className={`font-semibold ${
                        hasInsufficientBalance
                          ? "text-destructive"
                          : "text-foreground"
                      }`}
                    >
                      {formatCurrency((balance || 0) - amountValue)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/dashboard")}
                  disabled={isSubmitting || isPending}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || isPending || hasInsufficientBalance}
                  className="flex-1"
                >
                  {isSubmitting || isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Confirmar transferência"
                  )}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </Layout>
  );
}