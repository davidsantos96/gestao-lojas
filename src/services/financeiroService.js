import { api } from './api'

// ─── Resumo / KPIs ────────────────────────────────────────────────────────────
/**
 * GET /financeiro/resumo?mes=2026-03
 * → { receita, despesas, saldo, vence_7d }
 */
export function getResumoFinanceiro(params = {}) {
  return api.get('/financeiro/resumo', params)
}

// ─── Fluxo de Caixa ───────────────────────────────────────────────────────────
/**
 * GET /financeiro/cashflow?meses=7
 * → [{ mes, receitas, despesas, lucro }]
 */
export function getCashflow(params = {}) {
  return api.get('/financeiro/cashflow', params)
}

// ─── Contas a Pagar ───────────────────────────────────────────────────────────
/**
 * GET /financeiro/contas-pagar?status=pendente
 */
export function getContasPagar(params = {}) {
  return api.get('/financeiro/contas-pagar', params)
}

/**
 * POST /financeiro/contas-pagar
 * body: { descricao, vencimento, valor, categoria }
 */
export function createContaPagar(data) {
  return api.post('/financeiro/contas-pagar', data)
}

/**
 * PATCH /financeiro/contas-pagar/:id/pagar
 * Marca conta como paga
 */
export function pagarConta(id) {
  return api.patch(`/financeiro/contas-pagar/${id}/pagar`)
}

// ─── Contas a Receber ─────────────────────────────────────────────────────────
/**
 * GET /financeiro/contas-receber?status=pendente
 */
export function getContasReceber(params = {}) {
  return api.get('/financeiro/contas-receber', params)
}

/**
 * POST /financeiro/contas-receber
 * body: { descricao, cliente, vencimento, valor }
 */
export function createContaReceber(data) {
  return api.post('/financeiro/contas-receber', data)
}

/**
 * PATCH /financeiro/contas-receber/:id/receber
 * Marca conta como recebida
 */
export function receberConta(id) {
  return api.patch(`/financeiro/contas-receber/${id}/receber`)
}

// ─── DRE ──────────────────────────────────────────────────────────────────────
/**
 * GET /financeiro/dre?mes=2026-03
 * → { linhas: [...], margem_bruta, margem_liquida, ticket_medio, total_transacoes }
 */
export function getDRE(params = {}) {
  return api.get('/financeiro/dre', params)
}

// ─── Lançamento genérico ──────────────────────────────────────────────────────
/**
 * GET /financeiro/lancamentos?tipo=RECEITA&data_de=2026-01-01&data_ate=2026-03-31&categoria_id=<id>&page=1&limit=50
 * → { data, total, page, limit }
 */
export function getLancamentos(params = {}) {
  return api.get('/financeiro/lancamentos', params)
}

/**
 * POST /financeiro/lancamentos
 * body: { tipo: 'RECEITA'|'DESPESA', descricao, valor, data, categoria_id? }
 */
export function createLancamento(data) {
  return api.post('/financeiro/lancamentos', data)
}
