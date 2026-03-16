# Sistema de Controle de Lojas

Frontend do sistema de gestão para lojas, construído com React + Vite.

## Stack

- **React 18** + **Vite 5**
- **Recharts** — gráficos e dashboards
- **Lucide React** — ícones
- Dados mock em `src/data/mock.js` (substituir por API real)

## Estrutura

```
src/
├── constants/
│   └── theme.js            # Paleta de cores e constantes visuais
├── data/
│   └── mock.js             # Dados mock + configs de status
├── utils/
│   └── format.js           # Formatação de moeda, porcentagem etc.
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx     # Navegação lateral
│   │   └── Header.jsx      # Cabeçalho com breadcrumb
│   └── ui/
│       ├── Card.jsx        # Container base
│       ├── KPI.jsx         # Card de métrica
│       ├── Tag.jsx         # Badge de status
│       └── ChartTooltip.jsx
├── modules/
│   ├── dashboard/
│   │   └── Dashboard.jsx   # Visão geral com KPIs e gráficos
│   ├── estoque/
│   │   ├── Estoque.jsx         # Módulo principal
│   │   ├── TabelaProdutos.jsx  # Listagem de produtos
│   │   ├── TabelaMovimentos.jsx
│   │   └── ModalMovimentacao.jsx
│   └── financeiro/
│       ├── Financeiro.jsx      # Módulo principal
│       ├── Cashflow.jsx        # Gráfico de fluxo de caixa
│       ├── ContasPagar.jsx
│       ├── ContasReceber.jsx
│       └── DRE.jsx
├── App.jsx
└── main.jsx
```

## Módulos

| Módulo       | Status     |
|--------------|------------|
| Dashboard    | ✅ Ativo   |
| Estoque      | ✅ Ativo   |
| Financeiro   | ✅ Ativo   |
| Vendas       | 🔜 Em breve |
| Clientes     | 🔜 Em breve |
| Fiscal       | 🔜 Em breve |
| Relatórios   | 🔜 Em breve |

## Rodando localmente

```bash
npm install
npm run dev
```

## Roadmap

- **Fase 1** — Fundação: auth, multi-tenancy, CI/CD
- **Fase 2** — Operacional: Estoque + PDV ← *estamos aqui*
- **Fase 3** — Fiscal & Financeiro: NF-e, conciliação bancária
- **Fase 4** — CRM & BI: fidelização, dashboards avançados
