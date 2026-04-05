import { useState } from "react";
import Layout from "@/components/Layout";
import BackToTransferButton from "@/components/BackToTransferButton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShieldCheck,
  CircleDollarSign,
  Clock3,
  Save,
  CheckCircle,
  TriangleAlert,
} from "lucide-react";

interface LimitState {
  dailyLimit: string;
  nightlyLimit: string;
  transactionLimit: string;
}

export default function PixLimites() {
  const [limits, setLimits] = useState<LimitState>({
    dailyLimit: "5000",
    nightlyLimit: "1000",
    transactionLimit: "1500",
  });

  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);

  const handleChange =
    (field: keyof LimitState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setLimits((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
      setSaved(false);
    };

  const handleSave = () => {
    setMessage("Limites Pix atualizados com sucesso.");
    setSaved(true);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const formatCurrency = (value: string) => {
    const number = Number(value || 0);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(number);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-3">
          <BackToTransferButton />
          <div>
            <h1 className="text-4xl font-bold text-foreground">Meus limites Pix</h1>
            <p className="text-muted-foreground mt-2">
              Consulte e ajuste seus limites de movimentação via Pix
            </p>
          </div>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg border text-sm ${
              saved
                ? "border-green-500/20 bg-green-500/10 text-green-600"
                : "border-primary/20 bg-primary/5 text-foreground"
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <CircleDollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Limite diário</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(limits.dailyLimit)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Clock3 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Limite noturno</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(limits.nightlyLimit)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Por transação</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(limits.transactionLimit)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="p-6 space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Ajustar limites
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Defina os valores máximos para suas transações Pix
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Limite diário
              </label>
              <Input
                type="number"
                min="0"
                step="100"
                value={limits.dailyLimit}
                onChange={handleChange("dailyLimit")}
                placeholder="5000"
              />
              <p className="text-xs text-muted-foreground">
                Valor total permitido para movimentações Pix durante o dia.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Limite noturno
              </label>
              <Input
                type="number"
                min="0"
                step="100"
                value={limits.nightlyLimit}
                onChange={handleChange("nightlyLimit")}
                placeholder="1000"
              />
              <p className="text-xs text-muted-foreground">
                Aplicado no período noturno para maior segurança.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Limite por transação
              </label>
              <Input
                type="number"
                min="0"
                step="100"
                value={limits.transactionLimit}
                onChange={handleChange("transactionLimit")}
                placeholder="1500"
              />
              <p className="text-xs text-muted-foreground">
                Valor máximo permitido em uma única transação Pix.
              </p>
            </div>

            <Button type="button" onClick={handleSave} className="w-full sm:w-auto">
              <Save className="w-4 h-4 mr-2" />
              Salvar limites
            </Button>
          </Card>

          <Card className="p-6 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Informações importantes
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Entenda como os limites Pix funcionam
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-secondary text-sm text-muted-foreground">
                Alterações de limites podem levar algum tempo para entrar em vigor.
              </div>

              <div className="p-4 rounded-lg bg-secondary text-sm text-muted-foreground">
                Limites noturnos ajudam a reduzir riscos em horários sensíveis.
              </div>

              <div className="p-4 rounded-lg bg-secondary text-sm text-muted-foreground">
                Em casos específicos, aumentos de limite podem exigir validação adicional.
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-xl bg-destructive/10 text-destructive">
              <TriangleAlert className="w-5 h-5" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">
                Segurança dos seus limites
              </h2>
              <p className="text-sm text-muted-foreground">
                Ajuste seus limites de acordo com sua rotina. Para movimentações
                mais altas, revise seus valores com frequência e mantenha suas
                configurações alinhadas ao seu uso real.
              </p>

              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                Seus limites atuais estão ativos.
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}