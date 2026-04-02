/**
 * SERVIÇO DE EXPORTAÇÃO EM PDF
 *
 * Gera extratos bancários em PDF com:
 * - Informações do usuário
 * - Lista de transações
 * - Resumo de gastos
 * - Cores do projeto
 *
 * Padrão: Enterprise
 */

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { User, Transaction, TransactionType } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export async function exportTransactionsToPDF(
  user: User,
  transactions: Transaction[]
) {
  try {
    // Criar elemento HTML temporário
    const element = document.createElement("div");
    element.style.padding = "20px";
    element.style.backgroundColor = "#ffffff";
    element.style.color = "#000000";
    element.style.fontFamily = "Arial, sans-serif";
    element.style.width = "210mm";
    element.style.minHeight = "297mm";

    // Header
    const header = `
      <div style="border-bottom: 2px solid #00d9ff; padding-bottom: 20px; margin-bottom: 20px;">
        <h1 style="color: #00d9ff; margin: 0; font-size: 28px;">TutsBank</h1>
        <p style="color: #666; margin: 5px 0 0 0; font-size: 12px;">Seu banco moderno e seguro</p>
      </div>
    `;

    // Informações do usuário
    const userInfo = `
      <div style="margin-bottom: 20px;">
        <h2 style="color: #333; font-size: 16px; margin: 0 0 10px 0;">Extrato Bancário</h2>
        <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
          <tr>
            <td style="padding: 5px; color: #666;"><strong>Titular:</strong></td>
            <td style="padding: 5px; color: #333;">${user.name}</td>
            <td style="padding: 5px; color: #666;"><strong>CPF:</strong></td>
            <td style="padding: 5px; color: #333;">${maskCPF(user.cpf)}</td>
          </tr>
          <tr>
            <td style="padding: 5px; color: #666;"><strong>Conta:</strong></td>
            <td style="padding: 5px; color: #333;">${user.accountNumber}</td>
            <td style="padding: 5px; color: #666;"><strong>Saldo:</strong></td>
            <td style="padding: 5px; color: #00d9ff; font-weight: bold;">R$ ${user.balance.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 5px; color: #666;"><strong>Data:</strong></td>
            <td style="padding: 5px; color: #333;">${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</td>
            <td style="padding: 5px; color: #666;"><strong>Período:</strong></td>
            <td style="padding: 5px; color: #333;">Últimas 30 dias</td>
          </tr>
        </table>
      </div>
    `;

    // Resumo
    const totalGastos = transactions
      .filter((tx) => tx.type === TransactionType.TRANSFER)
      .reduce((sum, tx) => sum + tx.amount, 0);

    const totalRecebimentos = transactions
      .filter((tx) => tx.type === TransactionType.DEPOSIT)
      .reduce((sum, tx) => sum + tx.amount, 0);

    const summary = `
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #00d9ff;">
        <table style="width: 100%; font-size: 12px;">
          <tr>
            <td style="padding: 5px;">
              <strong>Total de Gastos:</strong><br/>
              <span style="color: #ef4444; font-size: 14px; font-weight: bold;">R$ ${totalGastos.toFixed(2)}</span>
            </td>
            <td style="padding: 5px;">
              <strong>Total Recebido:</strong><br/>
              <span style="color: #00d9ff; font-size: 14px; font-weight: bold;">R$ ${totalRecebimentos.toFixed(2)}</span>
            </td>
            <td style="padding: 5px;">
              <strong>Saldo Líquido:</strong><br/>
              <span style="color: #333; font-size: 14px; font-weight: bold;">R$ ${(totalRecebimentos - totalGastos).toFixed(2)}</span>
            </td>
          </tr>
        </table>
      </div>
    `;

    // Transações
    let transactionsHTML = `
      <div>
        <h3 style="color: #333; font-size: 14px; margin: 0 0 10px 0;">Transações (${transactions.length})</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
          <thead>
            <tr style="background-color: #f5f5f5; border-bottom: 2px solid #00d9ff;">
              <th style="padding: 8px; text-align: left; color: #333;">Data</th>
              <th style="padding: 8px; text-align: left; color: #333;">Descrição</th>
              <th style="padding: 8px; text-align: left; color: #333;">Tipo</th>
              <th style="padding: 8px; text-align: right; color: #333;">Valor</th>
            </tr>
          </thead>
          <tbody>
    `;

    transactions.forEach((tx, index) => {
      const isExpense =
        tx.type === TransactionType.TRANSFER ||
        tx.type === TransactionType.WITHDRAWAL;
      const bgColor = index % 2 === 0 ? "#ffffff" : "#f9f9f9";
      const valueColor = isExpense ? "#ef4444" : "#00d9ff";
      const valuePrefix = isExpense ? "-" : "+";

      transactionsHTML += `
        <tr style="background-color: ${bgColor}; border-bottom: 1px solid #e5e5e5;">
          <td style="padding: 8px; color: #666;">${format(new Date(tx.date), "dd/MM/yyyy", { locale: ptBR })}</td>
          <td style="padding: 8px; color: #333;">${tx.description}</td>
          <td style="padding: 8px; color: #666;">${getTransactionTypeLabel(tx.type)}</td>
          <td style="padding: 8px; text-align: right; color: ${valueColor}; font-weight: bold;">${valuePrefix}R$ ${tx.amount.toFixed(2)}</td>
        </tr>
      `;
    });

    transactionsHTML += `
          </tbody>
        </table>
      </div>
    `;

    // Footer
    const footer = `
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; font-size: 10px; color: #999; text-align: center;">
        <p>Este é um documento gerado automaticamente pelo TutsBank.</p>
        <p>Gerado em ${format(new Date(), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}</p>
      </div>
    `;

    element.innerHTML = header + userInfo + summary + transactionsHTML + footer;
    document.body.appendChild(element);

    // Converter para canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
      logging: false,
    });

    // Criar PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let yPosition = 0;
    let pageHeight = pdf.internal.pageSize.getHeight();

    while (yPosition < imgHeight) {
      if (yPosition > 0) {
        pdf.addPage();
      }

      pdf.addImage(
        imgData,
        "PNG",
        0,
        -yPosition,
        imgWidth,
        imgHeight
      );

      yPosition += pageHeight;
    }

    // Download
    pdf.save(
      `extrato-${user.name.replace(/\s+/g, "-").toLowerCase()}-${format(new Date(), "yyyy-MM-dd")}.pdf`
    );

    // Limpar
    document.body.removeChild(element);
  } catch (error) {
    console.error("Erro ao exportar PDF:", error);
    throw error;
  }
}

function maskCPF(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.***.***.***");
}

function getTransactionTypeLabel(type: TransactionType): string {
  switch (type) {
    case TransactionType.TRANSFER:
      return "Transferência";
    case TransactionType.DEPOSIT:
      return "Depósito";
    case TransactionType.WITHDRAWAL:
      return "Saque";
    default:
      return "Desconhecido";
  }
}
