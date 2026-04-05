import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useGetTransactions, useGetBalance } from "@/hooks/useQueries";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, ArrowDownLeft, TrendingUp, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TransactionType, TransactionStatus, Transaction } from "@/types";
import TransactionDetailsModal from "@/components/TransactionDetailsModal";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: transactions, isLoading: txLoading } = useGetTransactions(
    user?.id || null
  );
  const { data: balance, isLoading: balanceLoading } = useGetBalance(
    user?.id || null
  );

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.TRANSFER:
        return <ArrowUpRight className="w-4 h-4" />;
      case TransactionType.DEPOSIT:
        return <ArrowDownLeft className="w-4 h-4" />;
      case TransactionType.WITHDRAWAL:
        return <ArrowUpRight className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.COMPLETED:
        return <Badge className="bg-green-500">Concluída</Badge>;
      case TransactionStatus.PENDING:
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case TransactionStatus.FAILED:
        return <Badge className="bg-red-500">Falha</Badge>;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="space-y-8 animate-fadeInUp">
        <div className="animate-fadeInDown">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Bem-vindo, {user?.name}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Conta: {user?.accountNumber}
          </p>
        </div>

        <Card className="p-6 md:p-8 bg-gradient-to-br from-primary to-primary/80 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-scaleIn">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-xs md:text-sm font-medium">
                  Saldo Disponível
                </p>
                {balanceLoading ? (
                  <div className="flex items-center gap-2 mt-2">
                    <Loader2 className="w-6 h-6 animate-spin text-primary-foreground" />
                  </div>
                ) : (
                  <p className="text-3xl md:text-4xl font-bold text-primary-foreground mt-2">
                    {formatCurrency(balance || 0)}
                  </p>
                )}
              </div>
              <TrendingUp className="w-10 md:w-12 h-10 md:h-12 text-primary-foreground/20" />
            </div>

            <Button
              onClick={() => navigate("/transfer")}
              className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Nova Transferência
            </Button>
          </div>
        </Card>

        <div className="animate-slideInLeft">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Transações Recentes
          </h2>

          {txLoading ? (
            <Card className="p-8 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </Card>
          ) : transactions && transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((tx, index) => (
                <Card
                  key={tx.id}
                  onClick={() => {
                    setSelectedTransaction(tx);
                    setIsTransactionModalOpen(true);
                  }}
                  className="p-4 hover:bg-secondary hover:shadow-md hover:border-primary/20 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer animate-fadeInUp"
                  style={{
                    animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`,
                  }}
                  title="Clique para ver detalhes"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="p-2 bg-secondary rounded-lg flex-shrink-0">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground truncate">
                          {tx.description}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {tx.recipientName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(tx.date), "dd MMM yyyy, HH:mm", {
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="text-right space-y-2 flex-shrink-0">
                      <p className="font-bold text-foreground text-sm md:text-base">
                        {tx.type === TransactionType.TRANSFER ||
                        tx.type === TransactionType.WITHDRAWAL
                          ? "-"
                          : "+"}
                        {formatCurrency(tx.amount)}
                      </p>
                      {getStatusBadge(tx.status)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                Nenhuma transação registrada
              </p>
            </Card>
          )}

          {transactions && transactions.length > 5 && (
            <Button
              variant="outline"
              className="w-full mt-4 transition-all duration-200 transform hover:scale-105 active:scale-95"
              onClick={() => navigate("/history")}
            >
              Ver Histórico Completo
            </Button>
          )}
        </div>

        <TransactionDetailsModal
          open={isTransactionModalOpen}
          onClose={() => setIsTransactionModalOpen(false)}
          transaction={selectedTransaction}
        />
      </div>
    </Layout>
  );
}
