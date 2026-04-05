import { describe, it, expect, beforeEach } from "vitest";
import { authService, transactionService } from "@/services/api";

describe("Transaction Service", () => {
  let userId: string;

  beforeEach(async () => {
    localStorage.clear();

    const response = await authService.login({
      email: "user@tutsbank.com",
      password: "password123#",
    });

    userId = response.user.id;
  });

  describe("getTransactions", () => {
    it("should return transactions for user", async () => {
      const transactions = await transactionService.getTransactions(userId);

      expect(Array.isArray(transactions)).toBe(true);
      expect(transactions.length).toBeGreaterThan(0);
      expect(transactions[0]).toHaveProperty("id");
      expect(transactions[0]).toHaveProperty("amount");
      expect(transactions[0]).toHaveProperty("type");
    });
  });

  describe("transfer", () => {
    it("should successfully transfer funds", async () => {
      const userBefore = JSON.parse(localStorage.getItem("user")!);
      const initialBalance = userBefore.balance;

      const response = await transactionService.transfer(userId, {
        recipientAccount: "5678-9",
        recipientName: "Maria Santos",
        amount: 100,
        description: "Pagamento de conta",
      });

      expect(response.success).toBe(true);
      expect(response.transaction).toBeDefined();
      expect(response.transaction.amount).toBe(100);
      expect(response.newBalance).toBe(initialBalance - 100);
    });

    it("should fail with insufficient balance", async () => {
      try {
        await transactionService.transfer(userId, {
          recipientAccount: "5678-9",
          recipientName: "Maria Santos",
          amount: 10000,
          description: "Pagamento de conta",
        });

        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
        expect((error as Error).message).toContain("Saldo insuficiente");
      }
    });

    it("should fail with invalid amount", async () => {
      try {
        await transactionService.transfer(userId, {
          recipientAccount: "5678-9",
          recipientName: "Maria Santos",
          amount: -100,
          description: "Pagamento de conta",
        });

        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
        expect((error as Error).message).toContain("Valor deve ser maior");
      }
    });

    it("should update balance after transfer", async () => {
      const userBefore = JSON.parse(localStorage.getItem("user")!);
      const balanceBefore = userBefore.balance;

      await transactionService.transfer(userId, {
        recipientAccount: "5678-9",
        recipientName: "Maria Santos",
        amount: 250,
        description: "Pagamento de conta",
      });

      const userAfter = JSON.parse(localStorage.getItem("user")!);
      expect(userAfter.balance).toBe(balanceBefore - 250);
    });

    it("should add transaction to history", async () => {
      const transactionsBefore = await transactionService.getTransactions(userId);
      const countBefore = transactionsBefore.length;

      await transactionService.transfer(userId, {
        recipientAccount: "5678-9",
        recipientName: "Maria Santos",
        amount: 100,
        description: "Pagamento de conta",
      });

      const transactionsAfter = await transactionService.getTransactions(userId);
      expect(transactionsAfter.length).toBe(countBefore + 1);
      expect(transactionsAfter[0].description).toBe("Pagamento de conta");
    });
  });

  describe("getTransactionById", () => {
    it("should return transaction by id", async () => {
      const transactions = await transactionService.getTransactions(userId);
      const transactionId = transactions[0].id;

      const transaction = await transactionService.getTransactionById(
        userId,
        transactionId
      );

      expect(transaction).toBeDefined();
      expect(transaction.id).toBe(transactionId);
    });

    it("should fail with invalid transaction id", async () => {
      try {
        await transactionService.getTransactionById(userId, "invalid-id");
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
        expect((error as Error).message).toContain("Transação não encontrada");
      }
    });
  });
});