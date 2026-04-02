/**
 * STORE DE TRANSAÇÕES (ZUSTAND)
 *
 * Gerencia estado de transações e histórico.
 * Integra-se com React Query para sincronização de dados.
 *
 * Uso:
 * const { transactions, addTransaction } = useTransactionStore();
 */

import { create } from "zustand";
import { Transaction, TransactionType, TransactionStatus } from "@/types";

interface TransactionFilters {
  type?: TransactionType;
  status?: TransactionStatus;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

interface TransactionStore {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  filters: TransactionFilters;

  // Actions
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  removeTransaction: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: TransactionFilters) => void;
  clearFilters: () => void;
  getFilteredTransactions: () => Transaction[];
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  loading: false,
  error: null,
  filters: {},

  setTransactions: (transactions: Transaction[]) => {
    set({ transactions });
  },

  addTransaction: (transaction: Transaction) => {
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    }));
  },

  removeTransaction: (id: string) => {
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    }));
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setFilters: (filters: TransactionFilters) => {
    set({ filters });
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  getFilteredTransactions: () => {
    const state = get();
    let filtered = [...state.transactions];

    // Filtrar por tipo
    if (state.filters.type) {
      filtered = filtered.filter((t) => t.type === state.filters.type);
    }

    // Filtrar por status
    if (state.filters.status) {
      filtered = filtered.filter((t) => t.status === state.filters.status);
    }

    // Filtrar por data
    if (state.filters.dateRange) {
      const { from, to } = state.filters.dateRange;
      filtered = filtered.filter((t) => {
        const date = new Date(t.date);
        return date >= from && date <= to;
      });
    }

    return filtered;
  },
}));

// ============================================================================
// SELETORES
// ============================================================================

export const useTransactions = () =>
  useTransactionStore((state) => state.transactions);

export const useTransactionLoading = () =>
  useTransactionStore((state) => state.loading);

export const useTransactionError = () =>
  useTransactionStore((state) => state.error);

export const useTransactionFilters = () =>
  useTransactionStore((state) => state.filters);

export const useFilteredTransactions = () =>
  useTransactionStore((state) => state.getFilteredTransactions());
