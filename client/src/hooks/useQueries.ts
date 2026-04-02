/**
 * HOOKS REACT QUERY
 *
 * Encapsula todas as queries e mutations da aplicação.
 * Padrão enterprise com:
 * - Tipagem forte
 * - Tratamento de erros centralizado
 * - Caching automático
 * - Sincronização com Zustand
 *
 * Uso:
 * const { data: transactions } = useGetTransactions(userId);
 * const { mutate: transfer } = useTransfer();
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  Transaction,
  TransferPayload,
  TransferResponse,
  User,
} from "@/types";
import {
  authService,
  transactionService,
  accountService,
} from "@/services/api";
import { useTransactionStore } from "@/store/transactionStore";

// ============================================================================
// QUERY KEYS (PARA CACHE)
// ============================================================================

export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    currentUser: ["auth", "currentUser"] as const,
  },
  transactions: {
    all: ["transactions"] as const,
    byUser: (userId: string) => ["transactions", userId] as const,
    byId: (userId: string, id: string) => ["transactions", userId, id] as const,
  },
  account: {
    all: ["account"] as const,
    balance: (userId: string) => ["account", userId, "balance"] as const,
  },
};

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Obter usuário atual
 */
export const useGetCurrentUser = (): UseQueryResult<User, Error> => {
  return useQuery({
    queryKey: queryKeys.auth.currentUser,
    queryFn: () => authService.getCurrentUser(),
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 1,
  });
};

/**
 * Obter transações do usuário
 */
export const useGetTransactions = (
  userId: string | null
): UseQueryResult<Transaction[], Error> => {
  return useQuery<Transaction[], Error>({
    queryKey: queryKeys.transactions.byUser(userId || ""),
    queryFn: () => {
      if (!userId) throw new Error("User ID is required");
      return transactionService.getTransactions(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
};

/**
 * Obter saldo da conta
 */
export const useGetBalance = (
  userId: string | null
): UseQueryResult<number, Error> => {
  return useQuery({
    queryKey: queryKeys.account.balance(userId || ""),
    queryFn: () => {
      if (!userId) throw new Error("User ID is required");
      return accountService.getBalance(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 30, // 30 segundos
  });
};

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Realizar transferência
 */
export const useTransfer = (): UseMutationResult<
  TransferResponse,
  Error,
  { userId: string; payload: TransferPayload },
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }) =>
      transactionService.transfer(userId, payload),
    onSuccess: (data, variables) => {
      // Atualizar cache de transações
      queryClient.invalidateQueries({
        queryKey: queryKeys.transactions.byUser(variables.userId),
      });

      // Atualizar cache de saldo
      queryClient.invalidateQueries({
        queryKey: queryKeys.account.balance(variables.userId),
      });

      // Adicionar transação ao store local
      useTransactionStore.getState().addTransaction(data.transaction);
    },
    onError: (error) => {
      console.error("Transfer error:", error);
    },
  });
};

/**
 * Logout
 */
export const useLogout = (): UseMutationResult<void, Error, void, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Limpar todo o cache
      queryClient.clear();
    },
  });
};

/**
 * Atualizar perfil do usuário
 */
export const useUpdateProfile = (): UseMutationResult<
  User,
  Error,
  { userId: string; updates: Partial<User> },
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, updates }) =>
      accountService.updateProfile(userId, updates),
    onSuccess: () => {
      // Invalidar cache de usuário atual
      queryClient.invalidateQueries({
        queryKey: queryKeys.auth.currentUser,
      });
    },
  });
};
