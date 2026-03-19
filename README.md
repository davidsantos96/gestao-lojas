# Sistema de Controle de Lojas — Frontend

Frontend do sistema de gestão para lojas, construído com **React 18 + Vite 5**, integrado a uma API NestJS.

---

## Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 18 | UI principal |
| Vite | 5 | Bundler / dev server |
| Recharts | 2 | Gráficos e dashboards |
| Lucide React | 0.383 | Ícones |

**Backend:** `gestao-lojas-api` (NestJS + Prisma + PostgreSQL via Supabase)

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
npm run db:generate   # gera o Prisma Client
npm run db:migrate    # aplica migrations
npm run db:seed       # popula dados iniciais (opcional)
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
├── constants/
│   └── theme.js                # Paleta de cores e constantes visuais (C.*)
│
├── data/
│   └── mock.js                 # Dados fallback para dev offline
│
├── utils/
│   └── format.js               # fmtBRL, fmtPct, fmtK
│
├── services/                   # Camada de comunicação com a API
│   ├── api.js                  # Cliente HTTP base (fetch + timeout + auth)
│   ├── authService.js          # login, logout, getMe
│   ├── financeiroService.js    # resumo, cashflow, contas, lançamentos, DRE
│   ├── vendasService.js        # getVendas
│   └── ...
│
├── hooks/                      # Custom hooks de estado e lógica
│   ├── useAsync.js             # Hook genérico de chamadas assíncronas
│   ├── useAuth.jsx             # Autenticação + logout automático por inatividade
│   ├── useIdleTimer.js         # Timer de inatividade (5 min → alerta 30s antes)
│   ├── useFinanceiro.js        # Resumo, cashflow, contas a pagar/receber, DRE
│   ├── useProdutos.js          # CRUD de produtos do estoque
│   ├── useMovimentos.js        # Movimentações de estoque
│   └── useVendas.js            # Lista de vendas + resumo do mês (RECEITA)
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx         # Navegação lateral colapsável (mobile: gaveta)
│   │   └── Header.jsx          # Cabeçalho com data/hora ao vivo + toggle de menu
│   └── ui/
│       ├── Card.jsx            # Container base reutilizável
│       ├── KPI.jsx             # Card de métrica com ícone e variação
│       ├── Tag.jsx             # Badge de status colorido
│       ├── Skeleton.jsx        # Loading states (SkeletonTable, SkeletonCard)
│       ├── EmptyState.jsx      # Estado vazio padronizado
│       ├── ErrorState.jsx      # Estado de erro com botão de retry
│       └── ChartTooltip.jsx    # Tooltip personalizado para Recharts
│
├── modules/
│   ├── auth/
│   │   └── LoginPage.jsx       # Tela de login
│   ├── dashboard/
│   │   └── Dashboard.jsx       # KPIs, cashflow, alertas e atalhos
│   ├── estoque/
│   │   ├── Estoque.jsx         # Módulo principal (abas)
│   │   ├── TabelaProdutos.jsx  # Listagem com filtros e CRUD
│   │   ├── TabelaMovimentos.jsx
│   │   └── ModalMovimentacao.jsx
│   ├── financeiro/
│   │   ├── Financeiro.jsx      # Módulo principal (abas)
│   │   ├── Cashflow.jsx        # Gráfico de fluxo de caixa mensal
│   │   ├── ContasPagar.jsx     # Contas com ação de pagamento
│   │   ├── ContasReceber.jsx
│   │   └── DRE.jsx             # Demonstrativo de Resultado do Exercício
│   └── vendas/
│       └── Vendas.jsx          # Histórico de vendas + cards de resumo do mês
│
├── App.jsx                     # Roteamento, estado global de layout, idle logout
└── main.jsx
```

---

## Módulos

| Módulo | Status | Descrição |
|---|---|---|
| **Dashboard** | ✅ Ativo | KPIs consolidados, cashflow, alertas de estoque |
| **Estoque** | ✅ Ativo | Gestão de produtos e movimentações |
| **Financeiro** | ✅ Ativo | Contas a pagar/receber, DRE, cashflow |
| **Vendas** | ✅ Ativo | Histórico de vendas + total do mês |
| **Clientes** | 🔜 Em breve | — |
| **Fiscal** | 🔜 Em breve | — |
| **Relatórios** | 🔜 Em breve | — |

---

## Funcionalidades de UX

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
- **Fase 4** 🔜 CRM & BI: fidelização, dashboards avançados
