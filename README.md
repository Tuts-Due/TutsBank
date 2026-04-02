# 🏦 TutsBank

Aplicação web bancária desenvolvida como solução para o desafio técnico de Front-End da Onda Finance, com foco em organização, experiência do usuário e boas práticas de desenvolvimento.

## 📋 Objetivo

Construir uma aplicação web que simule um app bancário simples, contemplando:

- Login mock com persistência de sessão
- Dashboard com saldo e transações
- Transferência com validação
- Atualização de saldo em tela
- Testes automatizados
- Documentação técnica clara

O projeto foi desenvolvido com foco em legibilidade, arquitetura organizada e facilidade de evolução.

---

## 🚀 Tecnologias utilizadas

Este projeto foi desenvolvido com a stack solicitada no desafio:

- React
- TypeScript
- Vite
- Tailwind CSS
- CVA
- shadcn/ui
- Radix UI
- React Router
- React Query
- Zustand
- React Hook Form
- Zod
- Axios
- Vitest

---

## 🏗️ Arquitetura

A aplicação foi organizada em camadas para facilitar manutenção e evolução:

- **Pages**: composição das telas e lógica de UI
- **Hooks**: encapsulamento de regras reutilizáveis
- **Services**: camada de mock/API e regras de negócio
- **Store**: estado global e persistência com Zustand
- **Components**: componentes visuais reutilizáveis

### Estrutura de pastas

```bash
TutsBank/
├── client/
│   ├── index.html
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── auth.test.ts
│   │   │   └── transactions.test.ts
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useQueries.ts
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Transfer.tsx
│   │   │   ├── History.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── Settings.tsx
│   │   │   └── NotFound.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── store/
│   │   │   ├── authStore.ts
│   │   │   └── transactionStore.ts
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
├── server/
│   └── index.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

---

## ✅ Funcionalidades implementadas

### Login mock
- Tela de login com validação
- Persistência de sessão
- Redirecionamento após autenticação
- Exibição de erro em caso de credenciais inválidas

### Dashboard
- Exibição do saldo disponível
- Listagem de transações recentes
- Navegação rápida para transferência e histórico

### Transferência
- Formulário validado com Zod
- Validação de conta, nome, valor e descrição
- Verificação de saldo insuficiente
- Atualização de saldo e histórico após transferência
- Feedback visual de sucesso

### Persistência de sessão
- Sessão persistida com Zustand
- Restauração automática ao reabrir a aplicação
- Rotas protegidas

### Tema
- Alternância entre tema claro e escuro
- Persistência da preferência do usuário

---

## 🧠 Decisões técnicas adotadas

### React Router
Utilizado para navegação entre páginas e proteção de rotas, garantindo separação entre áreas públicas e autenticadas.

### Zustand
Escolhido para o gerenciamento de estado global por ser leve, simples e bem integrado com TypeScript, especialmente para autenticação e persistência de sessão.

### React Query
Utilizado para organizar queries e mutations, além de facilitar o controle de cache e atualização automática da interface após transferências.

### React Hook Form + Zod
Escolhidos para validação de formulários com tipagem forte, mensagens claras de erro e melhor experiência de desenvolvimento.

### Axios com mock de API
A camada de serviço foi organizada como se a aplicação consumisse uma API real, permitindo uma estrutura mais próxima de um cenário de produção, mesmo com dados simulados localmente.

---

## 🔒 Segurança

Conforme solicitado no desafio, abaixo está a explicação de como a aplicação **seria protegida** em um cenário real.

### Proteção contra engenharia reversa
Em produção, a aplicação poderia ser protegida com:

- Minificação e ofuscação parcial do bundle
- Separação clara entre frontend e backend
- Autenticação real via backend
- Uso de variáveis de ambiente apenas para dados não sensíveis no frontend
- Desativação de source maps em produção, quando apropriado

Também é importante destacar que lógica sensível, validações críticas e regras financeiras não devem depender apenas do frontend.

### Proteção contra vazamento de dados
Em uma versão real, eu adotaria:

- HTTPS obrigatório
- Tokens em cookies HttpOnly e Secure
- Sanitização de inputs e outputs
- Rate limiting no backend
- Logs sem dados sensíveis
- Mascaramento de informações pessoais
- Validação no frontend e no backend
- Políticas de CORS e CSP

Neste projeto, como o backend é mockado, essa parte foi documentada e não implementada integralmente, conforme permitido pelo enunciado do desafio.

---

## 🧪 Testes

Foram implementados testes automatizados cobrindo fluxos importantes da aplicação.

### Cobertura atual
- autenticação
- armazenamento de sessão
- logout
- leitura de usuário autenticado
- listagem de transações
- transferência
- validações de erro
- consulta de transação por ID

### Resultado
- **15 testes implementados**
- **15 testes passando**

---

## ▶️ Como rodar o projeto

### Pré-requisitos
- Node.js 18+
- pnpm 10+

### Instalação

```bash
git clone https://github.com/Tuts-Due/TutsBank.git
cd TutsBank
pnpm install
```

### Rodar em desenvolvimento

```bash
pnpm dev
```

Depois, abra no navegador a URL exibida no terminal pelo Vite.

### Verificação de tipos

```bash
pnpm check
```

### Rodar testes

```bash
pnpm test --run
```

### Build de produção

```bash
pnpm build
```

---

## 🔑 Credenciais de teste

```txt
Email: user@tutsbank.com
Senha: password123
```

---

## 🌱 Melhorias futuras

- Integração com backend real
- Persistência em banco de dados
- Histórico com filtros e paginação
- Exportação de extrato em PDF
- Dashboard com gráficos
- Integração com PIX
- Notificações em tempo real
- Testes de integração e E2E
- Uso de cookies HttpOnly com backend real
- Controle mais robusto de sessão e expiração de token

---

## 📦 Scripts disponíveis

```bash
pnpm dev          # ambiente de desenvolvimento
pnpm build        # build de produção
pnpm preview      # preview do build
pnpm test         # testes em modo watch
pnpm test:ui      # interface visual do Vitest
pnpm check        # verificação de tipos
pnpm format       # formatação com Prettier
```

---

## 📌 Considerações finais

Este projeto foi desenvolvido com foco em:

- organização de código
- componentização
- boas práticas de arquitetura
- validação de formulários
- gerenciamento de estado previsível
- experiência de uso fluida

O objetivo foi entregar uma solução funcional, clara e tecnicamente consistente para o desafio proposto.

---

## 👨‍💻 Autor

Arthur Dué
