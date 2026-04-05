import { useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Transaction, TransactionType, TransactionStatus } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Download,
  FileImage,
  FileText,
  Calendar,
  User,
  CreditCard,
  Wallet,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface TransactionDetailsModalProps {
  open: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

function getTypeLabel(type: TransactionType) {
  switch (type) {
    case TransactionType.TRANSFER:
      return "Transferência";
    case TransactionType.DEPOSIT:
      return "Depósito";
    case TransactionType.WITHDRAWAL:
      return "Saque";
    case TransactionType.PIX:
      return "Pix";
    default:
      return "Transação";
  }
}

function getStatusLabel(status: TransactionStatus) {
  switch (status) {
    case TransactionStatus.COMPLETED:
      return "Concluída";
    case TransactionStatus.PENDING:
      return "Pendente";
    case TransactionStatus.FAILED:
      return "Falhou";
    default:
      return "Status desconhecido";
  }
}

export default function TransactionDetailsModal({
  open,
  onClose,
  transaction,
}: TransactionDetailsModalProps) {
  const exportRef = useRef<HTMLDivElement | null>(null);

  if (!transaction) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("pt-BR");
  };

  const handleDownloadImage = async () => {
    if (!exportRef.current) return;

    try {
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      });

      const link = document.createElement("a");
      link.download = `transacao-${transaction.id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast.success("Imagem gerada com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao gerar imagem.");
    }
  };

  const handleDownloadPdf = async () => {
    if (!exportRef.current) return;

    try {
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = 190;
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
      pdf.save(`transacao-${transaction.id}.pdf`);

      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao gerar PDF.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={value => !value && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes da transação</DialogTitle>
          <DialogDescription>
            Visualize os dados completos e exporte como imagem ou PDF.
          </DialogDescription>
        </DialogHeader>

        <div
          ref={exportRef}
          className="rounded-xl border p-6 space-y-6"
          style={{
            backgroundColor: "#ffffff",
            borderColor: "#e5e7eb",
            color: "#0f172a",
          }}
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm" style={{ color: "#64748b" }}>
                Tipo
              </p>
              <h2 className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                {getTypeLabel(transaction.type)}
              </h2>
            </div>

            <div className="text-right">
              <p className="text-sm" style={{ color: "#64748b" }}>
                Valor
              </p>
              <p className="text-2xl font-bold" style={{ color: "#00d4aa" }}>
                {formatCurrency(transaction.amount)}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: "#f8fafc", color: "#0f172a" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Data</span>
              </div>
              <p className="text-sm" style={{ color: "#64748b" }}>
                {formatDate(transaction.date)}
              </p>
            </div>

            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: "#f8fafc", color: "#0f172a" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4" />
                <span className="font-medium">Status</span>
              </div>
              <p className="text-sm" style={{ color: "#64748b" }}>
                {getStatusLabel(transaction.status)}
              </p>
            </div>

            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: "#f8fafc", color: "#0f172a" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4" />
                <span className="font-medium">Destinatário</span>
              </div>
              <p className="text-sm" style={{ color: "#64748b" }}>
                {transaction.recipientName || "Não informado"}
              </p>
            </div>

            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: "#f8fafc", color: "#0f172a" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4" />
                <span className="font-medium">Conta / chave</span>
              </div>
              <p className="text-sm break-all" style={{ color: "#64748b" }}>
                {transaction.recipientAccount || "Não informado"}
              </p>
            </div>
          </div>

          <div
            className="p-4 rounded-lg"
            style={{ backgroundColor: "#f8fafc", color: "#0f172a" }}
          >
            <p className="text-sm font-medium mb-2">Descrição</p>
            <p className="text-sm" style={{ color: "#64748b" }}>
              {transaction.description || "Sem descrição"}
            </p>
          </div>

          <div
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: "#ecfeff",
              borderColor: "#99f6e4",
              color: "#0f172a",
            }}
          >
            <p className="text-xs mb-1" style={{ color: "#64748b" }}>
              ID da transação
            </p>
            <p className="text-sm font-medium break-all">{transaction.id}</p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3">
          <Button type="button" variant="outline" onClick={handleDownloadImage}>
            <FileImage className="w-4 h-4 mr-2" />
            Baixar imagem
          </Button>

          <Button type="button" variant="outline" onClick={handleDownloadPdf}>
            <Download className="w-4 h-4 mr-2" />
            Baixar PDF
          </Button>

          <Button type="button" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
