import { useState } from "react";
import Layout from "@/components/Layout";
import BackToTransferButton from "@/components/BackToTransferButton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarClock, CheckCircle2, Clock3, QrCode } from "lucide-react";
import { toast } from "sonner";

export default function PixAgendado() {
  const [recipientName, setRecipientName] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [amount, setAmount] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [description, setDescription] = useState("");
  const [scheduled, setScheduled] = useState(false);

  const handleSchedule = () => {
    if (!recipientName.trim()) {
      toast.error("Informe o nome do destinatário.");
      return;
    }

    if (!pixKey.trim()) {
      toast.error("Informe a chave Pix.");
      return;
    }

    if (!amount.trim() || Number(amount) <= 0) {
      toast.error("Informe um valor válido.");
      return;
    }

    if (!scheduleDate) {
      toast.error("Escolha uma data para agendamento.");
      return;
    }

    setScheduled(true);
    toast.success("Pix agendado com sucesso!");
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-3">
          <BackToTransferButton />
          <div>
            <h1 className="text-4xl font-bold text-foreground">Pix agendado</h1>
            <p className="text-muted-foreground mt-2">
              Programe um pagamento Pix para uma data futura
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <CalendarClock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Agendar Pix
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Defina os dados para agendamento do pagamento
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Nome do destinatário
                </label>
                <Input
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Ex: Maria Santos"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Chave Pix
                </label>
                <Input
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  placeholder="Digite a chave Pix"
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
                  Data do agendamento
                </label>
                <Input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Descrição <span className="text-muted-foreground">(opcional)</span>
                </label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: aluguel, mensalidade, serviço..."
                />
              </div>

              <Button type="button" onClick={handleSchedule} className="w-full sm:w-auto">
                <QrCode className="w-4 h-4 mr-2" />
                Confirmar agendamento
              </Button>
            </div>

            {scheduled && (
              <div className="p-5 rounded-xl border border-green-500/20 bg-green-500/10 space-y-3">
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Pix agendado com sucesso
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>Destinatário:</strong> {recipientName}</p>
                  <p><strong>Chave:</strong> {pixKey}</p>
                  <p><strong>Valor:</strong> R$ {Number(amount).toFixed(2)}</p>
                  <p><strong>Data:</strong> {new Date(scheduleDate).toLocaleDateString("pt-BR")}</p>
                  {description && <p><strong>Descrição:</strong> {description}</p>}
                </div>
              </div>
            )}
          </Card>

          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Agendamento</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Entenda esse fluxo no contexto do produto
                </p>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="p-4 rounded-lg bg-secondary">
                  O Pix pode ser preparado para execução futura.
                </div>
                <div className="p-4 rounded-lg bg-secondary">
                  Em sistemas reais, o agendamento inclui revalidação na data de execução.
                </div>
                <div className="p-4 rounded-lg bg-secondary">
                  Também pode haver cancelamento e histórico de agendamentos.
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Clock3 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Próximos passos</h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Essa tela pode evoluir para lista de agendamentos, edição,
                    cancelamento e aviso de execução.
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