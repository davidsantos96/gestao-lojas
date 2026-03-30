export const produtos = [
  { id: 1,  sku: 'CAM-001', nome: 'Camiseta Básica P',  categoria: 'Vestuário',  estoque: 47, minimo: 10, preco: 49.90,  custo: 22.00,  status: 'ok'  },
  { id: 2,  sku: 'CAM-002', nome: 'Camiseta Básica M',  categoria: 'Vestuário',  estoque: 8,  minimo: 10, preco: 49.90,  custo: 22.00,  status: 'low' },
  { id: 3,  sku: 'CAM-003', nome: 'Camiseta Básica G',  categoria: 'Vestuário',  estoque: 0,  minimo: 10, preco: 49.90,  custo: 22.00,  status: 'out' },
  { id: 4,  sku: 'CAL-001', nome: 'Calça Jeans 38',     categoria: 'Vestuário',  estoque: 23, minimo: 5,  preco: 149.90, custo: 65.00,  status: 'ok'  },
  { id: 5,  sku: 'CAL-002', nome: 'Calça Jeans 40',     categoria: 'Vestuário',  estoque: 15, minimo: 5,  preco: 149.90, custo: 65.00,  status: 'ok'  },
  { id: 6,  sku: 'TEN-001', nome: 'Tênis Casual 41',    categoria: 'Calçados',   estoque: 4,  minimo: 5,  preco: 239.90, custo: 110.00, status: 'low' },
  { id: 7,  sku: 'TEN-002', nome: 'Tênis Casual 42',    categoria: 'Calçados',   estoque: 11, minimo: 5,  preco: 239.90, custo: 110.00, status: 'ok'  },
  { id: 8,  sku: 'BON-001', nome: 'Boné Aba Curva',     categoria: 'Acessórios', estoque: 32, minimo: 8,  preco: 59.90,  custo: 18.00,  status: 'ok'  },
  { id: 9,  sku: 'BOL-001', nome: 'Bolsa Feminina',     categoria: 'Acessórios', estoque: 6,  minimo: 8,  preco: 189.90, custo: 75.00,  status: 'low' },
  { id: 10, sku: 'CIN-001', nome: 'Cinto Couro 90cm',   categoria: 'Acessórios', estoque: 19, minimo: 5,  preco: 79.90,  custo: 28.00,  status: 'ok'  },
]

export const movimentos = [
  { id: 1, data: '15/03/2026', produto: 'Camiseta Básica P', tipo: 'entrada', qtd: 20,  responsavel: 'Ana Lima',   origem: 'Fornecedor A' },
  { id: 2, data: '15/03/2026', produto: 'Calça Jeans 38',    tipo: 'saida',   qtd: 3,   responsavel: 'PDV',        origem: 'Venda #4821'  },
  { id: 3, data: '14/03/2026', produto: 'Tênis Casual 42',   tipo: 'entrada', qtd: 6,   responsavel: 'João Silva', origem: 'Fornecedor B' },
  { id: 4, data: '14/03/2026', produto: 'Boné Aba Curva',    tipo: 'saida',   qtd: 5,   responsavel: 'PDV',        origem: 'Venda #4820'  },
  { id: 5, data: '13/03/2026', produto: 'Bolsa Feminina',    tipo: 'saida',   qtd: 2,   responsavel: 'PDV',        origem: 'Venda #4819'  },
  { id: 6, data: '13/03/2026', produto: 'Camiseta Básica M', tipo: 'ajuste',  qtd: -4,  responsavel: 'Ana Lima',   origem: 'Inventário'   },
  { id: 7, data: '12/03/2026', produto: 'Cinto Couro 90cm',  tipo: 'entrada', qtd: 10,  responsavel: 'João Silva', origem: 'Fornecedor A' },
]

export const cashflowData = [
  { mes: 'Set', receitas: 42000, despesas: 28000, lucro: 14000 },
  { mes: 'Out', receitas: 38000, despesas: 25000, lucro: 13000 },
  { mes: 'Nov', receitas: 55000, despesas: 32000, lucro: 23000 },
  { mes: 'Dez', receitas: 78000, despesas: 41000, lucro: 37000 },
  { mes: 'Jan', receitas: 51000, despesas: 30000, lucro: 21000 },
  { mes: 'Fev', receitas: 46000, despesas: 27000, lucro: 19000 },
  { mes: 'Mar', receitas: 53000, despesas: 31000, lucro: 22000 },
]

export const contasPagar = [
  { id: 1, descricao: 'Fornecedor Têxtil Alfa',  vencimento: '20/03/2026', valor: 4800.00, status: 'pendente', categoria: 'Fornecedor' },
  { id: 2, descricao: 'Aluguel Loja Centro',      vencimento: '05/04/2026', valor: 3200.00, status: 'pendente', categoria: 'Aluguel'    },
  { id: 3, descricao: 'Energia Elétrica',         vencimento: '22/03/2026', valor: 480.00,  status: 'pendente', categoria: 'Utilities'  },
  { id: 4, descricao: 'Folha de Pagamento Mar',   vencimento: '05/04/2026', valor: 8500.00, status: 'pendente', categoria: 'RH'         },
  { id: 5, descricao: 'Fornecedor Calçados Beta', vencimento: '10/03/2026', valor: 2200.00, status: 'pago',     categoria: 'Fornecedor' },
  { id: 6, descricao: 'Internet / Telefonia',     vencimento: '18/03/2026', valor: 290.00,  status: 'vencido',  categoria: 'Utilities'  },
]

export const contasReceber = [
  { id: 1, descricao: 'Parcelamento Venda #4790', vencimento: '18/03/2026', valor: 1200.00, status: 'pendente', cliente: 'Maria Santos'   },
  { id: 2, descricao: 'Parcelamento Venda #4750', vencimento: '25/03/2026', valor: 800.00,  status: 'pendente', cliente: 'Carlos Oliveira' },
  { id: 3, descricao: 'Venda Atacado #210',       vencimento: '30/03/2026', valor: 5400.00, status: 'pendente', cliente: 'Boutique Nova'   },
  { id: 4, descricao: 'Parcelamento Venda #4712', vencimento: '08/03/2026', valor: 640.00,  status: 'recebido', cliente: 'Ana Beatriz'     },
  { id: 5, descricao: 'Parcelamento Venda #4701', vencimento: '01/03/2026', valor: 380.00,  status: 'vencido',  cliente: 'Pedro Lima'      },
]

export const dreData = [
  { label: 'Receita Bruta',             valor: 53000,  tipo: 'receita'   },
  { label: '(-) Devoluções',            valor: -1200,  tipo: 'desconto'  },
  { label: 'Receita Líquida',           valor: 51800,  tipo: 'subtotal'  },
  { label: '(-) CMV',                   valor: -18000, tipo: 'desconto'  },
  { label: 'Lucro Bruto',               valor: 33800,  tipo: 'subtotal'  },
  { label: '(-) Despesas Operacionais', valor: -12400, tipo: 'desconto'  },
  { label: 'EBITDA',                    valor: 21400,  tipo: 'subtotal'  },
  { label: '(-) Depreciação',           valor: -800,   tipo: 'desconto'  },
  { label: 'Lucro Líquido',             valor: 20600,  tipo: 'total'     },
]

// ─── Clientes com histórico de compras (para RFM) ─────────────────────────────
export const clientes = [
  {
    id: 1, nome: 'Maria Santos', email: 'maria@email.com', cidade: 'São Paulo',
    historico_compras: [
      { data: '25/03/2026', valor: 349.80, qtd_itens: 3 },
      { data: '10/03/2026', valor: 149.90, qtd_itens: 1 },
      { data: '20/02/2026', valor: 479.70, qtd_itens: 4 },
      { data: '05/02/2026', valor: 239.90, qtd_itens: 1 },
      { data: '15/01/2026', valor: 199.80, qtd_itens: 2 },
    ],
  },
  {
    id: 2, nome: 'Carlos Oliveira', email: 'carlos@email.com', cidade: 'São Paulo',
    historico_compras: [
      { data: '28/03/2026', valor: 239.90, qtd_itens: 1 },
      { data: '01/03/2026', valor: 299.80, qtd_itens: 2 },
      { data: '10/02/2026', valor: 149.90, qtd_itens: 1 },
      { data: '20/01/2026', valor: 539.70, qtd_itens: 4 },
    ],
  },
  {
    id: 3, nome: 'Ana Beatriz', email: 'ana@email.com', cidade: 'Campinas',
    historico_compras: [
      { data: '26/03/2026', valor: 189.90, qtd_itens: 1 },
      { data: '14/03/2026', valor: 109.80, qtd_itens: 2 },
      { data: '28/02/2026', valor: 349.80, qtd_itens: 3 },
      { data: '14/02/2026', valor: 79.90,  qtd_itens: 1 },
      { data: '01/02/2026', valor: 239.90, qtd_itens: 1 },
      { data: '10/01/2026', valor: 419.80, qtd_itens: 3 },
    ],
  },
  {
    id: 4, nome: 'Pedro Lima', email: 'pedro@email.com', cidade: 'Santos',
    historico_compras: [
      { data: '05/02/2026', valor: 149.90, qtd_itens: 1 },
      { data: '10/01/2026', valor: 299.80, qtd_itens: 2 },
    ],
  },
  {
    id: 5, nome: 'Fernanda Costa', email: 'fernanda@email.com', cidade: 'São Paulo',
    historico_compras: [
      { data: '22/03/2026', valor: 629.70, qtd_itens: 5 },
      { data: '08/03/2026', valor: 189.90, qtd_itens: 1 },
      { data: '18/02/2026', valor: 479.80, qtd_itens: 4 },
      { data: '04/02/2026', valor: 239.90, qtd_itens: 2 },
      { data: '20/01/2026', valor: 149.90, qtd_itens: 1 },
      { data: '05/01/2026', valor: 399.80, qtd_itens: 3 },
      { data: '20/12/2025', valor: 189.90, qtd_itens: 1 },
    ],
  },
  {
    id: 6, nome: 'Boutique Nova', email: 'boutique@email.com', cidade: 'Ribeirão Preto',
    historico_compras: [
      { data: '15/03/2026', valor: 2400.00, qtd_itens: 18 },
      { data: '10/02/2026', valor: 1800.00, qtd_itens: 14 },
      { data: '12/01/2026', valor: 3200.00, qtd_itens: 22 },
      { data: '05/12/2025', valor: 2600.00, qtd_itens: 20 },
    ],
  },
  {
    id: 7, nome: 'João Victor', email: 'joao@email.com', cidade: 'São Paulo',
    historico_compras: [
      { data: '10/01/2026', valor: 239.90, qtd_itens: 1 },
      { data: '05/11/2025', valor: 149.90, qtd_itens: 1 },
    ],
  },
  {
    id: 8, nome: 'Lucia Ferreira', email: 'lucia@email.com', cidade: 'Santo André',
    historico_compras: [
      { data: '20/08/2025', valor: 99.90, qtd_itens: 1 },
    ],
  },
  {
    id: 9, nome: 'Roberto Alves', email: 'roberto@email.com', cidade: 'Guarulhos',
    historico_compras: [
      { data: '18/03/2026', valor: 479.80, qtd_itens: 3 },
      { data: '02/02/2026', valor: 149.90, qtd_itens: 1 },
      { data: '15/01/2026', valor: 239.90, qtd_itens: 2 },
    ],
  },
  {
    id: 10, nome: 'Camila Souza', email: 'camila@email.com', cidade: 'São Paulo',
    historico_compras: [
      { data: '27/03/2026', valor: 189.90, qtd_itens: 1 },
      { data: '12/03/2026', valor: 299.80, qtd_itens: 2 },
      { data: '25/02/2026', valor: 59.90,  qtd_itens: 1 },
      { data: '10/02/2026', valor: 389.80, qtd_itens: 3 },
      { data: '28/01/2026', valor: 149.90, qtd_itens: 1 },
    ],
  },
]

export const STATUS_ESTOQUE = {
  ok:  { label: 'Normal', color: '#00d9a8', bg: 'rgba(0,217,168,.12)'  },
  low: { label: 'Baixo',  color: '#f7c948', bg: 'rgba(247,201,72,.12)' },
  out: { label: 'Zerado', color: '#ff5b6b', bg: 'rgba(255,91,107,.12)' },
}

export const STATUS_FIN = {
  pendente: { label: 'Pendente',  color: '#f7c948', bg: 'rgba(247,201,72,.12)'  },
  pago:     { label: 'Pago',      color: '#00d9a8', bg: 'rgba(0,217,168,.12)'   },
  recebido: { label: 'Recebido',  color: '#00d9a8', bg: 'rgba(0,217,168,.12)'   },
  vencido:  { label: 'Vencido',   color: '#ff5b6b', bg: 'rgba(255,91,107,.12)'  },
}
