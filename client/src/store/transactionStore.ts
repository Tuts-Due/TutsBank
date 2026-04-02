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

  setTransactions: (transactions) => set({ transactions }),

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),

  removeTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((transaction) => transaction.id !== id),
    })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setFilters: (filters) => set({ filters }),

  clearFilters: () => set({ filters: {} }),

  getFilteredTransactions: () => {
    const state = get();
    let filtered = [...state.transactions];

    if (state.filters.type) {
      filtered = filtered.filter((transaction) => transaction.type === state.filters.type);
    }

    if (state.filters.status) {
      filtered = filtered.filter((transaction) => transaction.status === state.filters.status);
    }

    if (state.filters.dateRange) {
      const { from, to } = state.filters.dateRange;
      filtered = filtered.filter((transaction) => {
        const date = new Date(transaction.date);
        return date >= from && date <= to;
      });
    }

    return filtered;
  },
}));

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