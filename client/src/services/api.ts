import axios from "axios";
import {
  LoginCredentials,
  AuthResponse,
  User,
  Transaction,
  TransactionType,
  TransactionStatus,
  TransferPayload,
  TransferResponse,
} from "@/types";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const MOCK_DELAY = 80;
const isTestEnv = import.meta.env.MODE === "test";

const MOCK_USERS: Record<string, User> = {
  "user@tutsbank.com": {
    id: "user-001",
    name: "Arthur Dué",
    email: "user@tutsbank.com",
    phone: "(11) 9999-9999",
    cpf: "123.456.789-00",
    accountNumber: "1234-5",
    balance: 5000.0,
    createdAt: new Date().toISOString(),
  },
};

const MOCK_TRANSACTIONS: Record<string, Transaction[]> = {
  "user-001": [
    {
      id: "txn-001",
      type: TransactionType.TRANSFER,
      status: TransactionStatus.COMPLETED,
      amount: 250.0,
      description: "Pagamento de conta",
      recipientName: "Maria Santos",
      recipientAccount: "5678-9",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
    {
      id: "txn-002",
      type: TransactionType.DEPOSIT,
      status: TransactionStatus.COMPLETED,
      amount: 1000.0,
      description: "Depósito de salário",
      recipientName: "TutsBank",
      recipientAccount: "0000-0",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
    },
    {
      id: "txn-003",
      type: TransactionType.WITHDRAWAL,
      status: TransactionStatus.COMPLETED,
      amount: 100.0,
      description: "Saque em caixa eletrônico",
      recipientName: "Caixa Eletrônico",
      recipientAccount: "ATM-001",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
    },
  ],
};

const simulateNetworkDelay = () =>
  new Promise<void>((resolve) => setTimeout(resolve, MOCK_DELAY));

const simulateRandomError = () => {
  if (isTestEnv) return;

  if (Math.random() < 0.05) {
    throw new Error("Erro simulado de rede");
  }
};

const getUserById = (userId: string) =>
  Object.values(MOCK_USERS).find((user) => user.id === userId);

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await simulateNetworkDelay();

    const user = MOCK_USERS[credentials.email];

    if (!user) {
      throw new Error("Email ou senha inválidos");
    }

    const token = `mock-token-${Date.now()}`;

    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));

    return { token, user };
  },

  logout: async (): Promise<void> => {
    await simulateNetworkDelay();
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  getCurrentUser: async (): Promise<User> => {
    await simulateNetworkDelay();
    simulateRandomError();

    const userJson = localStorage.getItem("user");

    if (!userJson) {
      throw new Error("Usuário não autenticado");
    }

    return JSON.parse(userJson);
  },
};

export const transactionService = {
  getTransactions: async (userId: string): Promise<Transaction[]> => {
    await simulateNetworkDelay();
    simulateRandomError();

    return MOCK_TRANSACTIONS[userId] || [];
  },

  transfer: async (
    userId: string,
    payload: TransferPayload
  ): Promise<TransferResponse> => {
    await simulateNetworkDelay();
    simulateRandomError();

    const user = getUserById(userId);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    if (payload.amount <= 0) {
      throw new Error("Valor deve ser maior que zero");
    }

    if (payload.amount > user.balance) {
      throw new Error("Saldo insuficiente");
    }

    const transaction: Transaction = {
      id: `txn-${Date.now()}`,
      type: TransactionType.TRANSFER,
      status: TransactionStatus.COMPLETED,
      amount: payload.amount,
      description: payload.description,
      recipientName: payload.recipientName,
      recipientAccount: payload.recipientAccount,
      date: new Date().toISOString(),
      timestamp: Date.now(),
    };

    user.balance -= payload.amount;

    if (!MOCK_TRANSACTIONS[userId]) {
      MOCK_TRANSACTIONS[userId] = [];
    }

    MOCK_TRANSACTIONS[userId].unshift(transaction);
    localStorage.setItem("user", JSON.stringify(user));

    return {
      success: true,
      transaction,
      newBalance: user.balance,
      message: "Transferência realizada com sucesso",
    };
  },

  getTransactionById: async (
    userId: string,
    transactionId: string
  ): Promise<Transaction> => {
    await simulateNetworkDelay();

    const transactions = MOCK_TRANSACTIONS[userId] || [];
    const transaction = transactions.find((item) => item.id === transactionId);

    if (!transaction) {
      throw new Error("Transação não encontrada");
    }

    return transaction;
  },
};

export const accountService = {
  getBalance: async (userId: string): Promise<number> => {
    await simulateNetworkDelay();

    const user = getUserById(userId);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return user.balance;
  },

  updateProfile: async (
    userId: string,
    updates: Partial<User>
  ): Promise<User> => {
    await simulateNetworkDelay();

    const user = getUserById(userId);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const updatedUser = { ...user, ...updates };

    MOCK_USERS[updatedUser.email] = updatedUser;
    localStorage.setItem("user", JSON.stringify(updatedUser));

    return updatedUser;
  },
};

export default apiClient;