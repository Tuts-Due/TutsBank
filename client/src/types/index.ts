/**
 * TIPOS CENTRALIZADOS DO PROJETO
 *
 * Arquivo único para todas as definições de tipos TypeScript.
 * Facilita manutenção, evita circular imports e garante consistência.
 *
 * Organização:
 * 1. Tipos de Autenticação
 * 2. Tipos de Transações
 * 3. Tipos de Usuário
 * 4. Tipos de Resposta API
 * 5. Tipos de Erros
 */

// ============================================================================
// 1. AUTENTICAÇÃO
// ============================================================================

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

// ============================================================================
// 2. USUÁRIO
// ============================================================================

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

// ============================================================================
// 3. TRANSAÇÕES
// ============================================================================

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

// ============================================================================
// 4. RESPOSTAS API
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================================================
// 5. ERROS
// ============================================================================

export interface ApiError {
  code: string;
  message: string;
  status: number;
  details?: Record<string, unknown>;
}

// ============================================================================
// 6. STORE STATE
// ============================================================================

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

export interface AppState {
  auth: AuthState;
  transactions: TransactionState;
}
