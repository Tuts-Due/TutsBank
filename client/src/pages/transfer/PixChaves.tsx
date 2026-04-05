import { useState } from "react";
import Layout from "@/components/Layout";
import BackToTransferButton from "@/components/BackToTransferButton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  KeyRound,
  Plus,
  ArrowDownToLine,
  Copy,
  Star,
  Trash2,
  ShieldCheck,
  Mail,
  Phone,
  FileText,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

type PixKeyType = "cpf" | "email" | "phone" | "random";

interface PixKey {
  id: string;
  type: PixKeyType;
  value: string;
  isPrimary?: boolean;
}

const initialKeys: PixKey[] = [
  {
    id: "1",
    type: "cpf",
    value: "123.456.789-00",
    isPrimary: true,
  },
  {
    id: "2",
    type: "email",
    value: "arthurdue@email.com",
  },
  {
    id: "3",
    type: "phone",
    value: "(82) 99999-9999",
  },
];

const keyTypeOptions: { value: PixKeyType; label: string }[] = [
  { value: "cpf", label: "CPF" },
  { value: "email", label: "E-mail" },
  { value: "phone", label: "Telefone" },
  { value: "random", label: "Chave aleatória" },
];

function getKeyIcon(type: PixKeyType) {
  switch (type) {
    case "cpf":
      return <FileText className="w-4 h-4" />;
    case "email":
      return <Mail className="w-4 h-4" />;
    case "phone":
      return <Phone className="w-4 h-4" />;
    case "random":
      return <Sparkles className="w-4 h-4" />;
    default:
      return <KeyRound className="w-4 h-4" />;
  }
}

function getKeyLabel(type: PixKeyType) {
  switch (type) {
    case "cpf":
      return "CPF";
    case "email":
      return "E-mail";
    case "phone":
      return "Telefone";
    case "random":
      return "Chave aleatória";
    default:
      return "Chave";
  }
}

export default function PixChaves() {
  const [pixKeys, setPixKeys] = useState<PixKey[]>(initialKeys);
  const [newKeyType, setNewKeyType] = useState<PixKeyType>("cpf");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [message, setMessage] = useState("");
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [openBringModal, setOpenBringModal] = useState(false);
  const [deleteKeyId, setDeleteKeyId] = useState<string | null>(null);

  const totalKeys = pixKeys.length;

  const clearMessageLater = () => {
    setTimeout(() => setMessage(""), 2500);
  };

  const resetKeyForm = () => {
    setNewKeyType("cpf");
    setNewKeyValue("");
  };

  const handleRegisterKey = () => {
    const value = newKeyValue.trim();

    if (!value) {
      setMessage("Informe uma chave para cadastrar.");
      clearMessageLater();
      return;
    }

    const alreadyExists = pixKeys.some(
      (key) => key.value.toLowerCase() === value.toLowerCase()
    );

    if (alreadyExists) {
      setMessage("Essa chave já está cadastrada.");
      clearMessageLater();
      return;
    }

    const newKey: PixKey = {
      id: crypto.randomUUID(),
      type: newKeyType,
      value,
      isPrimary: pixKeys.length === 0,
    };

    setPixKeys((prev) => [newKey, ...prev]);
    resetKeyForm();
    setMessage("Chave Pix cadastrada com sucesso.");
    clearMessageLater();
  };

  const handleBringKey = () => {
    const value = newKeyValue.trim();

    if (!value) {
      setMessage("Informe uma chave para trazer.");
      clearMessageLater();
      return;
    }

    const alreadyExists = pixKeys.some(
      (key) => key.value.toLowerCase() === value.toLowerCase()
    );

    if (alreadyExists) {
      setMessage("Essa chave já está cadastrada nesta conta.");
      clearMessageLater();
      return;
    }

    const newKey: PixKey = {
      id: crypto.randomUUID(),
      type: newKeyType,
      value,
      isPrimary: pixKeys.length === 0,
    };

    setPixKeys((prev) => [newKey, ...prev]);
    resetKeyForm();
    setMessage("Solicitação de portabilidade simulada com sucesso.");
    clearMessageLater();
  };

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setMessage("Chave copiada.");
      clearMessageLater();
    } catch {
      setMessage("Não foi possível copiar a chave.");
      clearMessageLater();
    }
  };

  const handleSetPrimary = (id: string) => {
    setPixKeys((prev) =>
      prev.map((key) => ({
        ...key,
        isPrimary: key.id === id,
      }))
    );
    setMessage("Chave principal atualizada.");
    clearMessageLater();
  };

  const handleDelete = (id: string) => {
    const nextKeys = pixKeys.filter((key) => key.id !== id);
    const hasPrimary = nextKeys.some((key) => key.isPrimary);

    if (!hasPrimary && nextKeys.length > 0) {
      nextKeys[0].isPrimary = true;
    }

    setPixKeys(nextKeys);
    setMessage("Chave removida.");
    clearMessageLater();
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-3">
          <BackToTransferButton />
          <div>
            <h1 className="text-4xl font-bold text-foreground">Minhas chaves Pix</h1>
            <p className="text-muted-foreground mt-2">
              Cadastre, gerencie e organize suas chaves Pix
            </p>
          </div>
        </div>

        {message && (
          <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 text-sm text-foreground">
            {message}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de chaves</p>
                <p className="text-2xl font-bold text-foreground">{totalKeys}</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-2xl font-bold text-foreground">Ativo</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Chave principal</p>
                <p className="text-base font-semibold text-foreground">
                  {pixKeys.find((key) => key.isPrimary)?.value || "Nenhuma"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="p-6 space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Cadastrar nova chave
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Escolha o tipo e informe a chave que deseja registrar
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Tipo de chave
              </label>
              <select
                value={newKeyType}
                onChange={(e) => setNewKeyType(e.target.value as PixKeyType)}
                className="w-full p-3 border border-border rounded-lg bg-background"
              >
                {keyTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Valor da chave
              </label>
              <Input
                value={newKeyValue}
                onChange={(e) => setNewKeyValue(e.target.value)}
                placeholder="Digite sua chave Pix"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                onClick={() => setOpenRegisterModal(true)}
                className="flex-1"
              >
                <Plus className="w-4 h-4 mr-2" />
                Registrar chave
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenBringModal(true)}
                className="flex-1"
              >
                <ArrowDownToLine className="w-4 h-4 mr-2" />
                Trazer chave
              </Button>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Dicas</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Boas práticas no uso das suas chaves Pix
              </p>
            </div>

            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="p-4 rounded-lg bg-secondary">
                Defina uma chave principal para facilitar recebimentos.
              </div>
              <div className="p-4 rounded-lg bg-secondary">
                Evite compartilhar dados sensíveis além da sua chave.
              </div>
              <div className="p-4 rounded-lg bg-secondary">
                Revise periodicamente suas chaves cadastradas.
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Chaves cadastradas
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie suas chaves Pix registradas
            </p>
          </div>

          <div className="space-y-4">
            {pixKeys.length === 0 ? (
              <div className="p-6 rounded-lg border border-dashed border-border text-center text-muted-foreground">
                Você ainda não possui chaves Pix cadastradas.
              </div>
            ) : (
              pixKeys.map((key) => (
                <div
                  key={key.id}
                  className="p-4 rounded-xl border border-border bg-card flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                      {getKeyIcon(key.type)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-foreground">
                          {getKeyLabel(key.type)}
                        </p>
                        {key.isPrimary && (
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                            Principal
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mt-1 break-all">
                        {key.value}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleCopy(key.value)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar
                    </Button>

                    {!key.isPrimary && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSetPrimary(key.id)}
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Tornar principal
                      </Button>
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDeleteKeyId(key.id)}
                      className="hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Dialog open={openRegisterModal} onOpenChange={setOpenRegisterModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar chave Pix</DialogTitle>
              <DialogDescription>
                Escolha o tipo de chave e informe o valor que deseja cadastrar.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Tipo de chave
                </label>
                <select
                  value={newKeyType}
                  onChange={(e) => setNewKeyType(e.target.value as PixKeyType)}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                >
                  {keyTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Valor da chave
                </label>
                <Input
                  value={newKeyValue}
                  onChange={(e) => setNewKeyValue(e.target.value)}
                  placeholder="Digite sua chave Pix"
                />
              </div>

              <div className="p-4 rounded-lg bg-secondary text-sm text-muted-foreground">
                {newKeyType === "cpf" && "Informe um CPF válido vinculado à conta."}
                {newKeyType === "email" && "Informe um e-mail válido e ativo."}
                {newKeyType === "phone" && "Informe um telefone com DDD."}
                {newKeyType === "random" &&
                  "A chave aleatória pode ser simulada neste projeto."}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpenRegisterModal(false);
                  resetKeyForm();
                }}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={() => {
                  handleRegisterKey();
                  setOpenRegisterModal(false);
                }}
              >
                Confirmar cadastro
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={openBringModal} onOpenChange={setOpenBringModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Trazer chave Pix</DialogTitle>
              <DialogDescription>
                Simule a portabilidade de uma chave Pix de outra instituição.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Tipo de chave
                </label>
                <select
                  value={newKeyType}
                  onChange={(e) => setNewKeyType(e.target.value as PixKeyType)}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                >
                  {keyTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Chave que deseja trazer
                </label>
                <Input
                  value={newKeyValue}
                  onChange={(e) => setNewKeyValue(e.target.value)}
                  placeholder="Digite a chave Pix"
                />
              </div>

              <div className="p-4 rounded-lg bg-secondary text-sm text-muted-foreground">
                Em um cenário real, esse processo dependeria de confirmação junto à
                instituição de origem.
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpenBringModal(false);
                  resetKeyForm();
                }}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={() => {
                  handleBringKey();
                  setOpenBringModal(false);
                }}
              >
                Solicitar portabilidade
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog
          open={!!deleteKeyId}
          onOpenChange={(open) => {
            if (!open) setDeleteKeyId(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir chave Pix</AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação removerá a chave cadastrada. Deseja continuar?
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (deleteKeyId) {
                    handleDelete(deleteKeyId);
                    setDeleteKeyId(null);
                  }
                }}
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}