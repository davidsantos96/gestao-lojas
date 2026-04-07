# Sistema de Controle de Lojas — Frontend

Frontend do sistema de gestão para lojas, construído com **React 18 + Vite 5**, integrado a uma API NestJS.

---

## Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 18 | UI principal |
| Vite | 5 | Bundler / dev server |
| Styled Components | 6 | CSS-in-JS |
| Recharts | 2 | Gráficos e dashboards |
| Lucide React | 0.383 | Ícones |

**Backend:** `gestao-lojas-api` (NestJS + PostgreSQL via Supabase)

---

## Variáveis de Ambiente

Crie um `.env.local` na raiz do projeto:

```env
VITE_API_URL=http://127.0.0.1:3000/api
VITE_API_TIMEOUT=10000
VITE_EMPRESA_ID=empresa-demo
```

---

## Rodando Localmente

### 1. Backend (gestao-lojas-api)

```bash
cd ../gestao-lojas-api
npm install
npm run start:dev     # inicia em modo watch na porta 3000
```

### 2. Frontend

```bash
npm install
npm run dev           # http://localhost:5173
```

---

## Estrutura do Projeto

```
src/
├── contexts/
│   └── ThemeContext.jsx        # Gerenciamento de tema (Light/Dark)
│
├── styles/
│   ├── global.js               # Estilos globais (Reset + Tokens CSS)
│   └── themes/                 # Definições de cores para light/dark mode
│
├── constants/
│   └── theme.js                # Paleta de cores legado / constantes (C.*)
│
├── data/
│   └── mock.js                 # Dados fallback para dev offline
│
├── utils/
│   └── format.js               # fmtBRL, fmtPct, fmtK, dates
│
├── services/                   # Camada de comunicação com a API
│   ├── api.js                  # Cliente HTTP base (axios/fetch wrapper)
│   ├── authService.js          # login, logout, getMe
│   ├── financeiroService.js    # resumo, cashflow, contas, lançamentos, DRE
│   ├── vendasService.js        # getVendas
│   ├── clienteService.js       # CRUD de clientes
│   └── estoqueService.js       # CRUD de produtos e movimentações
│
├── hooks/                      # Custom hooks de estado e lógica
│   ├── useAsync.js             # Hook genérico de chamadas assíncronas
│   ├── useAuth.jsx             # Autenticação + logout automático
│   ├── useIdleTimer.js         # Timer de inatividade
│   ├── useFinanceiro.js        # Resumo, cashflow, contas DRE
│   ├── useProdutos.js          # CRUD de produtos
│   ├── useMovimentos.js        # Movimentações de estoque
│   ├── useVendas.js            # Lista de vendas + resumo do mês
│   └── useRelatorios.js        # KPIs e visão geral para BI
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx         # Navegação lateral (mobile friendly)
│   │   └── Header.jsx          # Cabeçalho com data/hora e controles
│   └── ui/
│       ├── Card.jsx            # Container base
│       ├── KPI.jsx             # Card de métrica
│       ├── Tag.jsx             # Badge de status
│       ├── Skeleton.jsx        # Loading states
│       └── ...
│
├── modules/
│   ├── auth/                   # Tela de Login e recuperação
│   ├── dashboard/              # Visão geral, atalhos e KPIs rápidos
│   ├── estoque/                # Gestão de catálogo e movimentações
│   ├── financeiro/             # Fluxo de caixa, Contas P/R e DRE
│   ├── vendas/                 # PDV, Histórico e Checkout
│   ├── clientes/               # Gestão de base, segmentação e histórico
│   └── relatorios/             # BI: Visão Geral e analíticos do negócio
│
├── App.jsx                     # Roteamento e Providers globais
└── main.jsx
```

---

## Módulos

| Módulo | Status | Descrição |
|---|---|---|
| **Dashboard** | ✅ Ativo | KPIs consolidados, cashflow e alertas críticos |
| **Estoque** | ✅ Ativo | Gestão de catálogo, estoque mínimo e CRUD |
| **Financeiro** | ✅ Ativo | Fluxos, Contas P/R, DRE e Conciliação |
| **Vendas** | ✅ Ativo | PDV completo: Nova Venda, Histórico e Ticket Médio |
| **Clientes** | ✅ Ativo | CRM: Cadastro, Segmentação e Histórico de Gasto |
| **Relatórios** | ✅ Ativo | BI: Gráficos de performance, metas e evolução |
| **Fiscal** | 🔜 Em breve | NF-e e obrigações fiscais |

---

## Funcionalidades de UX

### Temas (Dark/Light Mode)
- Suporte a temas **Claro e Escuro** com persistência em `localStorage`.
- Detecção automática da preferência do sistema operacional.
- Troca de tema instantânea via `ThemeContext` e `Styled Components`.

### Autenticação
- Login com e-mail e senha via JWT
- Sessão persistida em `localStorage`
- **Logout automático por inatividade**: após **4min30s** sem interação, exibe modal de aviso com contagem regressiva de 30s; se não houver resposta, encerra a sessão

### Layout Responsivo
- Sidebar **colapsável** no desktop (botão hambúrguer no Header)
- Sidebar como **gaveta deslizante** no mobile (< 768px), com overlay escuro
- Ao navegar em mobile, a sidebar fecha automaticamente
- Header com **data e hora sincronizados em tempo real** (atualização a cada 1s)

### Cards de Resumo de Vendas
- Total de receitas do mês atual (via lançamentos `RECEITA` do módulo financeiro)
- Variação percentual em relação ao mês anterior
- Número de transações e ticket médio do mês

---

## Fluxo de Dados — Vendas

```
Venda registrada
    ├── Tabela Venda      → detalhes do produto, quantidade, preço
    └── Lancamento RECEITA → impacto financeiro (fonte única para o totalizador)

Card "Total do Mês" usa APENAS Lancamentos RECEITA para evitar dupla contagem.
```

---

## Roadmap

- **Fase 1** ✅ Fundação: auth, multi-tenancy, CI/CD
- **Fase 2** ✅ Operacional: Estoque + Vendas + Financeiro
- **Fase 3** 🚧 Fiscal & Financeiro avançado: NF-e, conciliação bancária
- **Fase 4** ✅ CRM & BI: Clientes, Segmentação e BI
