import { useState } from "react";
import Layout from "@/components/Layout";
import BackToTransferButton from "@/components/BackToTransferButton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HandCoins, QrCode, Copy, CheckCircle2, CalendarDays } from "lucide-react";
import { toast } from "sonner";

export default function PixCobrar() {
  const [payerName, setPayerName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [generated, setGenerated] = useState(false);
  const [pixCode, setPixCode] = useState("");

  const handleGenerateCharge = () => {
    if (!payerName.trim()) {
      toast.error("Informe o nome do pagador.");
      return;
    }

    if (!amount.trim() || Number(amount) <= 0) {
      toast.error("Informe um valor válido para a cobrança.");
      return;
    }

    const fakeCode = `PIXCOBRA-${Date.now()}-${payerName.replace(/\s+/g, "").toUpperCase()}`;
    setPixCode(fakeCode);
    setGenerated(true);

    toast.success("Cobrança Pix gerada com sucesso!");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      toast.success("Código da cobrança copiado!");
    } catch {
      toast.error("Não foi possível copiar o código.");
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-3">
          <BackToTransferButton />
          <div>
            <h1 className="text-4xl font-bold text-foreground">Cobrar</h1>
            <p className="text-muted-foreground mt-2">
              Gere uma cobrança Pix para compartilhar com outra pessoa
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <HandCoins className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Nova cobrança Pix
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Preencha os dados para criar uma cobrança
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Nome do pagador
                </label>
                <Input
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  placeholder="Ex: João Silva"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Valor
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Descrição
                </label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: reembolso, pagamento, serviço..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Vencimento <span className="text-muted-foreground">(opcional)</span>
                </label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <Button type="button" onClick={handleGenerateCharge} className="w-full sm:w-auto">
                <QrCode className="w-4 h-4 mr-2" />
                Gerar cobrança
              </Button>
            </div>

            {generated && (
              <div className="p-5 rounded-xl border border-green-500/20 bg-green-500/10 space-y-4">
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Cobrança criada com sucesso
                </div>

                <div className="space-y-2 text-sm">
                  <p><strong>Pagador:</strong> {payerName}</p>
                  <p><strong>Valor:</strong> R$ {Number(amount).toFixed(2)}</p>
                  {description && <p><strong>Descrição:</strong> {description}</p>}
                  {dueDate && <p><strong>Vencimento:</strong> {new Date(dueDate).toLocaleDateString("pt-BR")}</p>}
                </div>

                <div className="p-4 rounded-lg bg-background border border-border">
                  <p className="text-sm font-medium text-foreground">Código da cobrança</p>
                  <p className="text-sm text-muted-foreground mt-1 break-all">{pixCode}</p>
                </div>

                <Button type="button" variant="outline" onClick={handleCopy}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar código
                </Button>
              </div>
            )}
          </Card>

          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Como funciona</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Fluxo de cobrança Pix no projeto
                </p>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="p-4 rounded-lg bg-secondary">
                  Defina o valor e os dados da cobrança.
                </div>
                <div className="p-4 rounded-lg bg-secondary">
                  Gere um código Pix para compartilhamento.
                </div>
                <div className="p-4 rounded-lg bg-secondary">
                  Em uma versão real, essa cobrança poderia ter QR dinâmico e status.
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Evolução futura</h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Essa tela pode evoluir para cobrança com vencimento, multa,
                    juros, baixa automática e histórico de recebimentos.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}