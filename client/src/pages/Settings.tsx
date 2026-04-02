import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function Settings() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Configuracoes</h1>
          <p className="text-muted-foreground mt-2">
            Informacoes da sua conta
          </p>
        </div>

        {/* Perfil */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Perfil</h2>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Nome Completo</p>
              <p className="text-lg font-semibold text-foreground">{user?.name}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <p className="text-lg font-semibold text-foreground">{user?.email}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">CPF</p>
              <p className="text-lg font-semibold text-foreground">{user?.cpf}</p>
            </div>
          </div>
        </Card>

        {/* Conta */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Informacoes da Conta</h2>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Numero da Conta</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold text-foreground font-mono">
                  {user?.accountNumber}
                </p>
                <button
                  onClick={() => copyToClipboard(user?.accountNumber || "")}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Status da Conta</p>
              <Badge className="bg-green-500">Ativa</Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Data de Criacao</p>
              <p className="text-lg font-semibold text-foreground">
                {new Date(user?.createdAt || "").toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        </Card>

        {/* Seguranca */}
        <Card className="p-8 border-destructive/20 bg-destructive/5">
          <h2 className="text-2xl font-bold text-foreground mb-6">Seguranca</h2>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Sua conta esta protegida por autenticacao segura. Nunca compartilhe
              seus dados de login com terceiros.
            </p>

            <div className="p-4 bg-background rounded-lg border border-border">
              <p className="text-sm font-semibold text-foreground mb-2">
                Dicas de Seguranca:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>- Use senhas fortes e unicas</li>
                <li>- Nao compartilhe seu token de autenticacao</li>
                <li>- Verifique URLs antes de fazer login</li>
                <li>- Mantenha seu navegador atualizado</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
