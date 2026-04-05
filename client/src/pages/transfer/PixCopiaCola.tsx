import { useState } from "react";
import Layout from "@/components/Layout";
import BackToTransferButton from "@/components/BackToTransferButton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardPaste, CheckCircle, Info, QrCode } from "lucide-react";
import { toast } from "sonner";

export default function PixCopiaCola() {
  const [pixCode, setPixCode] = useState("");
  const [validated, setValidated] = useState(false);

  const handleValidateCode = () => {
    const trimmed = pixCode.trim();

    if (!trimmed) {
      toast.error("Cole um código Pix", {
        description: "Informe o código para validar o pagamento.",
      });
      return;
    }

    if (trimmed.length < 20) {
      toast.error("Código Pix inválido", {
        description: "O código informado parece incompleto.",
      });
      return;
    }

    setValidated(true);
    toast.success("Código Pix validado com sucesso!");
  };

  const handleConfirmPayment = () => {
    toast.success("Pagamento Pix simulado com sucesso!", {
      description: "Fluxo pronto para integração com backend real.",
    });

    setPixCode("");
    setValidated(false);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-3">
          <BackToTransferButton />
          <div>
            <h1 className="text-4xl font-bold text-foreground">Pix copia e cola</h1>
            <p className="text-muted-foreground mt-2">
              Cole um código Pix para validar e simular o pagamento
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <ClipboardPaste className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Inserir código Pix
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Cole o código fornecido para seguir com o pagamento
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Código Pix
              </label>
              <textarea
                value={pixCode}
                onChange={(e) => {
                  setPixCode(e.target.value);
                  setValidated(false);
                }}
                placeholder="Cole aqui o código Pix copia e cola"
                className="w-full min-h-[160px] rounded-lg border border-border bg-background p-4 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <p className="text-xs text-muted-foreground">
                Em um cenário real, esse conteúdo seria interpretado para montar o pagamento.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="button" onClick={handleValidateCode} className="flex-1">
                <QrCode className="w-4 h-4 mr-2" />
                Validar código
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setPixCode("");
                  setValidated(false);
                }}
                className="flex-1"
              >
                Limpar
              </Button>
            </div>

            {validated && (
              <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/10">
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <CheckCircle className="w-4 h-4" />
                  Código validado
                </div>
                <p className="text-sm text-green-700 dark:text-green-400 mt-2">
                  O código Pix foi aceito nesta simulação e está pronto para confirmação.
                </p>

                <div className="mt-4">
                  <Button type="button" onClick={handleConfirmPayment} className="w-full sm:w-auto">
                    Confirmar pagamento
                  </Button>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Informações</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Sobre o fluxo Pix copia e cola
              </p>
            </div>

            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="p-4 rounded-lg bg-secondary">
                O Pix copia e cola permite pagar a partir de um código textual.
              </div>
              <div className="p-4 rounded-lg bg-secondary">
                Em uma implementação real, esse código seria decodificado para extrair valor,
                destinatário e identificadores da cobrança.
              </div>
              <div className="p-4 rounded-lg bg-secondary">
                Aqui, o objetivo é representar a experiência e preparar a arquitetura para uma integração futura.
              </div>
            </div>

            <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 flex items-start gap-3">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                Essa tela é útil para mostrar, no portfólio, um fluxo financeiro brasileiro
                muito comum em apps bancários.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}