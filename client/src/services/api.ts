

import axios, { AxiosInstance, AxiosError } from "axios";
import {
  LoginCredentials,
  AuthResponse,
  User,
  Transaction,
  TransactionType,
  TransactionStatus,
  TransferPayload,
  TransferResponse,
  ApiResponse,
} from "@/types";



const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const MOCK_DELAY = 80; // Simular latência de rede (ms)

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);



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

// ============================================================================
// FUNÇÕES UTILITÁRIAS
// ============================================================================

/**
 * Simula latência de rede
 */
const simulateNetworkDelay = (): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
};

/**
 * Simula erro aleatório (5% de chance)
 */
const isTestEnv = import.meta.env.MODE === "test";

const simulateRandomError = (): void => {
  if (isTestEnv) return;

  if (Math.random() < 0.05) {
    throw new Error("Erro simulado de rede");
  }
};

export const authService = {
  /**
   * Login com credenciais
   * Mock: email=user@tutsbank.com, password=password123
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await simulateNetworkDelay();

    // Mock: aceita qualquer senha, mas email deve estar no sistema
    const user = MOCK_USERS[credentials.email];

    if (!user) {
      throw new Error("Email ou senha inválidos");
    }

    const token = `mock-token-${Date.now()}`;
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));

    return {
      token,
      user,
    };
  },

  /**
   * Logout
   */
  logout: async (): Promise<void> => {
    await simulateNetworkDelay();
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  /**
   * Obter usuário atual
   */
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

// ============================================================================
// SERVIÇO DE TRANSAÇÕES
// ============================================================================

export const transactionService = {
  /**
   * Listar transações do usuário
   */
  getTransactions: async (userId: string): Promise<Transaction[]> => {
    await simulateNetworkDelay();
    simulateRandomError();

    return MOCK_TRANSACTIONS[userId] || [];
  },

  /**
   * Realizar transferência
   */
  transfer: async (
    userId: string,
    payload: TransferPayload
  ): Promise<TransferResponse> => {
    await simulateNetworkDelay();
    simulateRandomError();

    const user = Object.values(MOCK_USERS).find((u) => u.id === userId);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Validações
    if (payload.amount <= 0) {
      throw new Error("Valor deve ser maior que zero");
    }

    if (payload.amount > user.balance) {
      throw new Error("Saldo insuficiente");
    }

    // Criar transação
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

    // Atualizar saldo
    user.balance -= payload.amount;

    // Adicionar transação ao histórico
    if (!MOCK_TRANSACTIONS[userId]) {
      MOCK_TRANSACTIONS[userId] = [];
    }
    MOCK_TRANSACTIONS[userId].unshift(transaction);

    // Persistir usuário atualizado
    localStorage.setItem("user", JSON.stringify(user));

    return {
      success: true,
      transaction,
      newBalance: user.balance,
      message: "Transferência realizada com sucesso",
    };
  },

  /**
   * Obter detalhes de uma transação
   */
  getTransactionById: async (
    userId: string,
    transactionId: string
  ): Promise<Transaction> => {
    await simulateNetworkDelay();

    const transactions = MOCK_TRANSACTIONS[userId] || [];
    const transaction = transactions.find((t) => t.id === transactionId);

    if (!transaction) {
      throw new Error("Transação não encontrada");
    }

    return transaction;
  },
};

// ============================================================================
// SERVIÇO DE CONTA
// ============================================================================

export const accountService = {
  /**
   * Obter saldo da conta
   */
  getBalance: async (userId: string): Promise<number> => {
    await simulateNetworkDelay();

    const user = Object.values(MOCK_USERS).find((u) => u.id === userId);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return user.balance;
  },

  /**
   * Atualizar perfil do usuário
   */
  updateProfile: async (
    userId: string,
    updates: Partial<User>
  ): Promise<User> => {
    await simulateNetworkDelay();

    const user = Object.values(MOCK_USERS).find((u) => u.id === userId);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const updated = { ...user, ...updates };
    MOCK_USERS[updated.email] = updated;
    localStorage.setItem("user", JSON.stringify(updated));

    return updated;
  },
};

// ============================================================================
// EXPORTAR CLIENTE AXIOS
// ============================================================================

export default apiClient;
