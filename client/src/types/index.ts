export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  accountNumber: string;
  balance: number;
  createdAt: string;
}

export enum TransactionType {
  TRANSFER = "transfer",
  DEPOSIT = "deposit",
  WITHDRAWAL = "withdrawal",
}

export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  description: string;
  recipientName: string;
  recipientAccount: string;
  date: string;
  timestamp: number;
}

export interface TransferPayload {
  recipientAccount: string;
  recipientName: string;
  amount: number;
  description: string;
}

export interface TransferResponse {
  success: boolean;
  transaction: Transaction;
  newBalance: number;
  message: string;
}

export interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  filters: {
    type?: TransactionType;
    status?: TransactionStatus;
    dateRange?: {
      from: Date;
      to: Date;
    };
  };
}
export enum PixKeyType {
  CPF = "cpf",
  EMAIL = "email",
  PHONE = "phone",
  RANDOM = "random",
}

export interface PixPayload {
  keyType: PixKeyType;
  pixKey: string;
  recipientName: string;
  amount: number;
  description: string;
}

export interface PixTransactionResponse {
  success: boolean;
  transaction: Transaction;
  newBalance: number;
  message: string;
}