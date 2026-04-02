import {
  useQuery,
  useMutation,
  useQueryClient,
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

export const queryKeys = {
  auth: {
    currentUser: ["auth", "currentUser"] as const,
  },
  transactions: {
    byUser: (userId: string) => ["transactions", userId] as const,
  },
  account: {
    balance: (userId: string) => ["account", userId, "balance"] as const,
  },
};

export const useGetCurrentUser = () => {
  return useQuery<User, Error>({
    queryKey: queryKeys.auth.currentUser,
    queryFn: authService.getCurrentUser,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useGetTransactions = (userId: string | null) => {
  return useQuery<Transaction[], Error>({
    queryKey: queryKeys.transactions.byUser(userId || ""),
    queryFn: () => {
      if (!userId) throw new Error("User ID is required");
      return transactionService.getTransactions(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  });
};

export const useGetBalance = (userId: string | null) => {
  return useQuery<number, Error>({
    queryKey: queryKeys.account.balance(userId || ""),
    queryFn: () => {
      if (!userId) throw new Error("User ID is required");
      return accountService.getBalance(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 30,
  });
};

export const useTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TransferResponse,
    Error,
    { userId: string; payload: TransferPayload }
  >({
    mutationFn: ({ userId, payload }) =>
      transactionService.transfer(userId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.transactions.byUser(variables.userId),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.account.balance(variables.userId),
      });

      useTransactionStore.getState().addTransaction(data.transaction);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<
    User,
    Error,
    { userId: string; updates: Partial<User> }
  >({
    mutationFn: ({ userId, updates }) =>
      accountService.updateProfile(userId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.auth.currentUser,
      });
    },
  });
};