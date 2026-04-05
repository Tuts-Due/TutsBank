import { useState } from "react";
import Layout from "@/components/Layout";
import BackToTransferButton from "@/components/BackToTransferButton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, Copy, QrCode, Wallet, CheckCircle2, Landmark } from "lucide-react";
import { toast } from "sonner";

export default function PixDepositar() {
  const [selectedKey, setSelectedKey] = useState("arthurdue@email.com");
  const [showQr, setShowQr] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(selectedKey);
      toast.success("Chave copiada com sucesso!");
    } catch {
      toast.error("Não foi possível copiar a chave.");
    }
  };

  const handleGenerateQr = () => {
    setShowQr(true);
    toast.success("QR Code de recebimento gerado!", {
      description: "Fluxo simulado para recebimento via Pix.",
    });
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-3">
          <BackToTransferButton />
          <div>
            <h1 className="text-4xl font-bold text-foreground">Depositar</h1>
            <p className="text-muted-foreground mt-2">
              Receba valores via Pix compartilhando sua chave ou QR Code
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <ArrowDownToLine className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Receber com Pix
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Compartilhe uma chave ou gere um QR Code para receber
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Chave selecionada
              </label>
              <select
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-background"
              >
                <option value="arthurdue@email.com">E-mail: arthurdue@email.com</option>
                <option value="123.456.789-00">CPF: 123.456.789-00</option>
                <option value="(82) 99999-9999">Telefone: (82) 99999-9999</option>
                <option value="c1f6-9ab2-33dd-xy89">Chave aleatória: c1f6-9ab2-33dd-xy89</option>
              </select>
            </div>

            <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
              <p className="text-sm font-medium text-foreground">Valor atual da chave</p>
              <p className="text-sm text-muted-foreground mt-1 break-all">
                {selectedKey}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="button" onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-2" />
                Copiar chave
              </Button>

              <Button type="button" variant="outline" onClick={handleGenerateQr}>
                <QrCode className="w-4 h-4 mr-2" />
                Gerar QR Code
              </Button>
            </div>

            {showQr && (
              <div className="p-6 rounded-xl border border-primary/20 bg-primary/5 flex flex-col items-center text-center">
                <div className="w-40 h-40 rounded-2xl bg-white border border-border flex items-center justify-center mb-4">
                  <QrCode className="w-20 h-20 text-primary" />
                </div>
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  QR Code gerado com sucesso
                </div>
                <p className="text-sm text-muted-foreground mt-2 max-w-md">
                  Em uma integração real, esse QR conteria os dados codificados da cobrança ou recebimento.
                </p>
              </div>
            )}
          </Card>

          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Depósito via Pix
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Neste contexto, depositar representa receber dinheiro na conta via chave ou QR Code.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Fluxo futuro
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Essa tela pode evoluir para cobranças com valor fixo, vencimento,
                    descrição do recebedor e histórico de recebimentos.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Dicas</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Boas práticas para recebimentos
                </p>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="p-4 rounded-lg bg-secondary">
                  Compartilhe a chave correta para evitar recebimentos indevidos.
                </div>
                <div className="p-4 rounded-lg bg-secondary">
                  Use QR Code quando quiser facilitar o pagamento por outra pessoa.
                </div>
                <div className="p-4 rounded-lg bg-secondary">
                  Em uma versão real, seria possível gerar cobrança com valor definido.
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}