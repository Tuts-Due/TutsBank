/**
 * LOGOUT MODAL
 *
 * Modal de confirmação para logout com:
 * - Cores do projeto (verde ciano + preto/branco)
 * - Animações suaves
 * - Dois botões (Cancelar / Confirmar)
 *
 * Padrão: Neo-Banking Minimalist
 */

import { AlertCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface LogoutModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function LogoutModal({
  open,
  onConfirm,
  onCancel,
  isLoading = false,
}: LogoutModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent className="border-border bg-card">
        {/* Header com ícone */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <AlertCircle className="w-5 h-5 text-primary" />
          </div>
          <AlertDialogHeader className="m-0 p-0">
            <AlertDialogTitle className="text-foreground">
              Confirmar saída
            </AlertDialogTitle>
          </AlertDialogHeader>
        </div>

        {/* Descrição */}
        <AlertDialogDescription className="text-muted-foreground mt-2">
          Você será desconectado de sua conta. Tem certeza que deseja sair?
        </AlertDialogDescription>

        {/* Botões */}
        <div className="flex gap-3 mt-6">
          <AlertDialogCancel
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 border-border hover:bg-secondary"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Saindo...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                Sair
              </>
            )}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
