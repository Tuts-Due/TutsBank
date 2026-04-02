import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Transaction, TransactionType } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ExpenseChartProps {
  transactions: Transaction[];
}

export function ExpenseChart({ transactions }: ExpenseChartProps) {
  const chartData = useMemo(() => {
    const monthlyData: Record<
      string,
      { month: string; gastos: number; recebimentos: number }
    > = {};

    transactions.forEach((tx) => {
      const date = new Date(tx.date);
      const monthKey = format(date, "yyyy-MM", { locale: ptBR });
      const monthLabel = format(date, "MMM", { locale: ptBR });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
          gastos: 0,
          recebimentos: 0,
        };
      }

      if (tx.type === TransactionType.TRANSFER) {
        monthlyData[monthKey].gastos += tx.amount;
      } else if (tx.type === TransactionType.DEPOSIT) {
        monthlyData[monthKey].recebimentos += tx.amount;
      }
    });

    return Object.values(monthlyData).slice(-6);
  }, [transactions]);

  const totalGastos = useMemo(
    () =>
      transactions
        .filter((tx) => tx.type === TransactionType.TRANSFER)
        .reduce((sum, tx) => sum + tx.amount, 0),
    [transactions]
  );

  const totalRecebimentos = useMemo(
    () =>
      transactions
        .filter((tx) => tx.type === TransactionType.DEPOSIT)
        .reduce((sum, tx) => sum + tx.amount, 0),
    [transactions]
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Total de Gastos</p>
          <p className="text-2xl font-bold text-destructive">
            R$ {totalGastos.toFixed(2)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Recebido</p>
          <p className="text-2xl font-bold text-primary">
            R$ {totalRecebimentos.toFixed(2)}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Gastos vs Recebimentos
        </h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
              />
              <XAxis
                dataKey="month"
                stroke="var(--color-muted-foreground)"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="var(--color-muted-foreground)"
                style={{ fontSize: "12px" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "var(--color-foreground)" }}
                formatter={(value: number) => `R$ ${value.toFixed(2)}`}
              />
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                iconType="square"
              />
              <Bar
                dataKey="gastos"
                fill="#ef4444"
                name="Gastos"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="recebimentos"
                fill="#00d9ff"
                name="Recebimentos"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            Nenhuma transação para exibir
          </div>
        )}
      </Card>
    </div>
  );
}