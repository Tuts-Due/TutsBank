import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useGetTransactions } from "@/hooks/useQueries";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  Filter,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TransactionType, TransactionStatus, Transaction } from "@/types";
import { ExpenseChart } from "@/components/ExpenseChart";
import { exportTransactionsToPDF } from "@/services/pdfExport";
import TransactionDetailsModal from "@/components/TransactionDetailsModal";

export default function History() {
  const { user } = useAuth();
  const { data: transactions, isLoading } = useGetTransactions(
    user?.id || null
  );
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterMinAmount, setFilterMinAmount] = useState<string>("");
  const [filterMaxAmount, setFilterMaxAmount] = useState<string>("");
  const [filterStartDate, setFilterStartDate] = useState<string>("");
  const [filterEndDate, setFilterEndDate] = useState<string>("");

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];

    return transactions.filter((tx) => {
      if (filterType !== "all" && tx.type !== filterType) {
        return false;
      }

      if (filterStatus !== "all" && tx.status !== filterStatus) {
        return false;
      }

      if (filterMinAmount && tx.amount < parseFloat(filterMinAmount)) {
        return false;
      }

      if (filterMaxAmount && tx.amount > parseFloat(filterMaxAmount)) {
        return false;
      }

      if (filterStartDate) {
        const txDate = new Date(tx.date);
        const startDate = new Date(filterStartDate);

        if (txDate < startDate) {
          return false;
        }
      }

      if (filterEndDate) {
        const txDate = new Date(tx.date);
        const endDate = new Date(filterEndDate);
        endDate.setHours(23, 59, 59, 999);

        if (txDate > endDate) {
          return false;
        }
      }

      return true;
    });
  }, [
    transactions,
    filterType,
    filterStatus,
    filterMinAmount,
    filterMaxAmount,
    filterStartDate,
    filterEndDate,
  ]);

  const hasActiveFilters =
    filterType !== "all" ||
    filterStatus !== "all" ||
    filterMinAmount ||
    filterMaxAmount ||
    filterStartDate ||
    filterEndDate;

  const resetFilters = () => {
    setFilterType("all");
    setFilterStatus("all");
    setFilterMinAmount("");
    setFilterMaxAmount("");
    setFilterStartDate("");
    setFilterEndDate("");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.TRANSFER:
        return <ArrowUpRight className="w-5 h-5" />;
      case TransactionType.DEPOSIT:
        return <ArrowDownLeft className="w-5 h-5" />;
      case TransactionType.WITHDRAWAL:
        return <ArrowUpRight className="w-5 h-5" />;
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
    }
  };

  const getTransactionTypeLabel = (type: TransactionType) => {
    switch (type) {
      case TransactionType.TRANSFER:
        return "Transferência";
      case TransactionType.DEPOSIT:
        return "Depósito";
      case TransactionType.WITHDRAWAL:
        return "Saque";
    }
  };

  const handleExportPDF = async () => {
    if (!user || !transactions) return;
    await exportTransactionsToPDF(user, filteredTransactions);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              Histórico de Transações
            </h1>
            <p className="text-muted-foreground mt-2">
              Todas as suas transações
            </p>
          </div>
          <Button
            onClick={handleExportPDF}
            disabled={!filteredTransactions.length}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar PDF
          </Button>
        </div>

        {transactions && transactions.length > 0 && (
          <ExpenseChart transactions={transactions} />
        )}

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros
            </h3>
            {hasActiveFilters && (
              <Button
                onClick={resetFilters}
                variant="ghost"
                size="sm"
                className="gap-1"
              >
                <X className="w-4 h-4" />
                Limpar
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tipo
              </label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value={TransactionType.TRANSFER}>
                    Transferência
                  </SelectItem>
                  <SelectItem value={TransactionType.DEPOSIT}>
                    Depósito
                  </SelectItem>
                  <SelectItem value={TransactionType.WITHDRAWAL}>
                    Saque
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value={TransactionStatus.COMPLETED}>
                    Concluída
                  </SelectItem>
                  <SelectItem value={TransactionStatus.PENDING}>
                    Pendente
                  </SelectItem>
                  <SelectItem value={TransactionStatus.FAILED}>
                    Falha
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Valor Mínimo
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={filterMinAmount}
                onChange={(e) => setFilterMinAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Valor Máximo
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={filterMaxAmount}
                onChange={(e) => setFilterMaxAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Data Inicial
              </label>
              <Input
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Data Final
              </label>
              <Input
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {isLoading ? (
          <Card className="p-8 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </Card>
        ) : filteredTransactions.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {filteredTransactions.length} transação(ões) encontrada(s)
            </p>
            {filteredTransactions.map((tx) => (
              <Card
                key={tx.id}
                onClick={() => {
                  setSelectedTransaction(tx);
                  setIsTransactionModalOpen(true);
                }}
                className="p-4 hover:bg-secondary transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`p-3 rounded-lg ${
                        tx.type === TransactionType.TRANSFER ||
                        tx.type === TransactionType.WITHDRAWAL
                          ? "bg-red-500/10"
                          : "bg-green-500/10"
                      }`}
                    >
                      <div
                        className={
                          tx.type === TransactionType.TRANSFER ||
                          tx.type === TransactionType.WITHDRAWAL
                            ? "text-red-500"
                            : "text-green-500"
                        }
                      >
                        {getTransactionIcon(tx.type)}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">
                          {tx.description}
                        </p>
                        <Badge variant="outline">
                          {getTransactionTypeLabel(tx.type)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {tx.recipientName}
                      </p>
                      <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                        <span>
                          {format(new Date(tx.date), "dd MMM yyyy", {
                            locale: ptBR,
                          })}
                        </span>
                        <span>
                          {format(new Date(tx.date), "HH:mm", {
                            locale: ptBR,
                          })}
                        </span>
                        <span>ID: {tx.id.slice(0, 8)}...</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-2">
                    <p
                      className={`text-lg font-bold ${
                        tx.type === TransactionType.TRANSFER ||
                        tx.type === TransactionType.WITHDRAWAL
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
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
              {hasActiveFilters
                ? "Nenhuma transação encontrada com os filtros aplicados"
                : "Nenhuma transação registrada"}
            </p>
          </Card>
        )}
      </div>
          <TransactionDetailsModal
            open={isTransactionModalOpen}
            onClose={() => setIsTransactionModalOpen(false)}
            transaction={selectedTransaction}
          />
    </Layout>
  );
}