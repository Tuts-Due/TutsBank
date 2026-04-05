import { useState } from "react";
import Layout from "@/components/Layout";
import BackToTransferButton from "@/components/BackToTransferButton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, FileSearch, Send, ShieldAlert, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function PixContestacao() {
  const [transactionId, setTransactionId] = useState("");
  const [reason, setReason] = useState("nao-reconheco");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!transactionId.trim()) {
      toast.error("Informe o identificador da transação.", {
        description: "Preencha o código ou id da transação Pix.",
      });
      return;
    }

    if (!details.trim()) {
      toast.error("Descreva o ocorrido.", {
        description: "Adicione mais detalhes para abrir a contestação.",
      });
      return;
    }

    setSubmitted(true);
    toast.success("Contestação enviada com sucesso!", {
      description: "Sua solicitação foi registrada para análise.",
    });
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-3">
          <BackToTransferButton />
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              Contestação de transação Pix
            </h1>
            <p className="text-muted-foreground mt-2">
              Registre uma solicitação para revisão de uma transação Pix
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Abrir contestação
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Informe os dados da transação para registrar a solicitação
                </p>
              </div>
            </div>

            {!submitted ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    ID ou código da transação
                  </label>
                  <Input
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Ex: PIX-2026-000123"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Motivo da contestação
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-3 border border-border rounded-lg bg-background"
                  >
                    <option value="nao-reconheco">Não reconheço essa transação</option>
                    <option value="valor-incorreto">Valor incorreto</option>
                    <option value="duplicidade">Cobrança/transferência em duplicidade</option>
                    <option value="fraude">Suspeita de fraude</option>
                    <option value="outro">Outro motivo</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Descreva o ocorrido
                  </label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Explique o que aconteceu com o máximo de detalhes possível"
                    className="w-full min-h-[160px] rounded-lg border border-border bg-background p-4 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                <Button type="button" onClick={handleSubmit} className="w-full sm:w-auto">
                  <Send className="w-4 h-4 mr-2" />
                  Enviar contestação
                </Button>
              </div>
            ) : (
              <div className="p-6 rounded-xl border border-green-500/20 bg-green-500/10">
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <CheckCircle2 className="w-5 h-5" />
                  Contestação registrada
                </div>
                <p className="text-sm text-green-700 dark:text-green-400 mt-2">
                  Sua solicitação foi enviada para análise. Em uma versão real,
                  esse processo incluiria protocolo, prazo e acompanhamento.
                </p>
              </div>
            )}
          </Card>

          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Quando contestar
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Situações em que esse fluxo pode ser utilizado
                </p>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="p-4 rounded-lg bg-secondary">
                  Transação não reconhecida no extrato.
                </div>
                <div className="p-4 rounded-lg bg-secondary">
                  Diferença entre valor esperado e valor efetivamente movimentado.
                </div>
                <div className="p-4 rounded-lg bg-secondary">
                  Suspeita de golpe, fraude ou erro operacional.
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Importante
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Em um produto real, a contestação depende de análise, prazo
                    regulatório, logs da transação e possível validação adicional.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <FileSearch className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Acompanhamento
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Esta tela pode evoluir futuramente para listar protocolos,
                    status da solicitação e histórico de análise.
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