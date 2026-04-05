import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Layout from "@/components/Layout";
import BackToTransferButton from "@/components/BackToTransferButton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Loader2, QrCode } from "lucide-react";

const pixSchema = z.object({
  keyType: z.enum(["cpf", "email", "phone", "random"]),
  pixKey: z.string().min(1, "Chave Pix obrigatória"),
  recipientName: z.string().min(2, "Nome obrigatório"),
  amount: z.coerce.number().min(1, "Valor deve ser maior que zero"),
  description: z.string().optional(),
});

type PixFormInput = z.input<typeof pixSchema>;
type PixFormData = z.output<typeof pixSchema>;

export default function Pix() {
  const { user } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PixFormInput, unknown, PixFormData>({
    resolver: zodResolver(pixSchema),
    defaultValues: {
      keyType: "cpf",
      pixKey: "",
      recipientName: "",
      amount: undefined,
      description: "",
    },
  });

  const onSubmit = async (data: PixFormData) => {
    try {
      setSuccessMessage(null);

      console.log("Pix enviado:", data);

      setSuccessMessage("Pix realizado com sucesso!");
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-3">
          <BackToTransferButton />
          <div>
            <h1 className="text-4xl font-bold text-foreground">Pix transferir</h1>
            <p className="text-muted-foreground mt-2">
              Envie pagamentos instantâneos usando chave Pix
            </p>
          </div>
        </div>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Saldo disponível</p>
          <p className="text-2xl font-bold text-primary">
            R$ {user?.balance?.toFixed(2)}
          </p>
        </Card>

        <Card className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Tipo de chave
              </label>
              <select
                {...register("keyType")}
                className="w-full p-3 border border-border rounded-lg bg-background"
              >
                <option value="cpf">CPF</option>
                <option value="email">E-mail</option>
                <option value="phone">Telefone</option>
                <option value="random">Chave aleatória</option>
              </select>
              {errors.keyType && (
                <p className="text-xs text-destructive">
                  {errors.keyType.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Chave Pix
              </label>
              <Input placeholder="Digite a chave" {...register("pixKey")} />
              {errors.pixKey && (
                <p className="text-xs text-destructive">
                  {errors.pixKey.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Nome do destinatário
              </label>
              <Input
                placeholder="Nome completo"
                {...register("recipientName")}
              />
              {errors.recipientName && (
                <p className="text-xs text-destructive">
                  {errors.recipientName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Valor
              </label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("amount")}
              />
              {errors.amount && (
                <p className="text-xs text-destructive">
                  {errors.amount.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Descrição <span className="text-muted-foreground">(opcional)</span>
              </label>
              <Input
                placeholder="Ex: almoço, pagamento..."
                {...register("description")}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4 mr-2" />
                  Enviar Pix
                </>
              )}
            </Button>

            {successMessage && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 text-sm">
                {successMessage}
              </div>
            )}
          </form>
        </Card>
      </div>
    </Layout>
  );
}