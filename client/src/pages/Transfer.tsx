import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useGetBalance } from "@/hooks/useQueries";
import { useNavigate } from "react-router-dom";
import {
  ArrowRightLeft,
  CreditCard,
  QrCode,
  ScanLine,
  ClipboardPaste,
  CalendarClock,
  HandCoins,
  Wallet,
  Zap,
  KeyRound,
  ShieldCheck,
  BadgeAlert,
  ArrowRight,
} from "lucide-react";

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

function ActionCard({ title, description, icon, onClick }: ActionCardProps) {
  return (
    <Card className="p-5 h-full">
      <div className="flex flex-col h-full justify-between gap-4">
        <div className="space-y-3">
          <div className="w-fit p-3 rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </div>

        <Button type="button" variant="outline" onClick={onClick} className="w-full">
          Acessar
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
}

export default function Transfer() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: balance } = useGetBalance(user?.id || null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            Transferências e Pix
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie transferências, Pix e serviços relacionados
          </p>
        </div>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Saldo disponível</p>
          <p className="text-3xl font-bold text-primary">
            {formatCurrency(balance || 0)}
          </p>
        </Card>

        {/* <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Área Pix</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Escolha como deseja movimentar seu dinheiro
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <ActionCard
              title="Transferência"
              description="Envie dinheiro para outra conta bancária."
              icon={<ArrowRightLeft className="w-5 h-5" />}
              onClick={() => navigate("/transfer/transferir")}
            />

            <ActionCard
              title="Área Pix"
              description="Acesse os serviços Pix disponíveis no app."
              icon={<QrCode className="w-5 h-5" />}
              onClick={() => navigate("/transfer/pix/enviar")}
            />
          </div>
        </section> */}

        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Área Pix</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Explore as funcionalidades do Pix para pagamentos e recebimentos
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <ActionCard
              title="Pix transferir"
              description="Envie um Pix para outra pessoa usando chave."
              icon={<QrCode className="w-5 h-5" />}
              onClick={() => navigate("/transfer/pix/enviar")}
            />

            {/* <ActionCard
              title="Pix no crédito"
              description="Simule pagamentos Pix no crédito."
              icon={<CreditCard className="w-5 h-5" />}
              onClick={() => navigate("/transfer/pix/credito")}
            /> */}

            <ActionCard
              title="Ler QR Code"
              description="Acesse a área de leitura de QR Code Pix."
              icon={<ScanLine className="w-5 h-5" />}
              onClick={() => navigate("/transfer/pix/qr-code")}
            />

            <ActionCard
              title="Pix copia e cola"
              description="Cole um código Pix e realize o pagamento."
              icon={<ClipboardPaste className="w-5 h-5" />}
              onClick={() => navigate("/transfer/pix/copia-cola")}
            />

            <ActionCard
              title="Pix agendado"
              description="Agende pagamentos Pix para outra data."
              icon={<CalendarClock className="w-5 h-5" />}
              onClick={() => navigate("/transfer/pix/agendado")}
            />

            <ActionCard
              title="Cobrar"
              description="Crie cobranças e compartilhe com outras pessoas."
              icon={<HandCoins className="w-5 h-5" />}
              onClick={() => navigate("/transfer/pix/cobrar")}
            />

            <ActionCard
              title="Depositar"
              description="Receba valores e gerencie entradas via Pix."
              icon={<Wallet className="w-5 h-5" />}
              onClick={() => navigate("/transfer/pix/depositar")}
            />
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Preferências</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Ajustes e controles da sua experiência com Pix
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <ActionCard
              title="Pix automático"
              description="Configure pagamentos automáticos via Pix."
              icon={<Zap className="w-5 h-5" />}
              onClick={() => navigate("/transfer/pix/automatico")}
            />

            <ActionCard
              title="Registrar ou trazer chaves"
              description="Gerencie suas chaves Pix cadastradas."
              icon={<KeyRound className="w-5 h-5" />}
              onClick={() => navigate("/transfer/pix/chaves")}
            />

            <ActionCard
              title="Meus limites Pix"
              description="Consulte e ajuste limites de uso do Pix."
              icon={<ShieldCheck className="w-5 h-5" />}
              onClick={() => navigate("/transfer/pix/limites")}
            />
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Suporte</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Canais para suporte e contestação
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <ActionCard
              title="Contestação de transação Pix"
              description="Abra uma solicitação para revisar uma transação Pix."
              icon={<BadgeAlert className="w-5 h-5" />}
              onClick={() => navigate("/transfer/pix/contestacao")}
            />
          </div>
        </section>
      </div>
    </Layout>
  );
}