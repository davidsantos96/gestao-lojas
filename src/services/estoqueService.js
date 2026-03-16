import { api } from './api'

// ─── Produtos ─────────────────────────────────────────────────────────────────

/**
 * Lista produtos com filtros opcionais
 * GET /estoque/produtos?status=low&categoria=Vestuário&busca=camiseta&page=1&limit=20
 */
export function getProdutos(params = {}) {
  return api.get('/estoque/produtos', params)
}

/**
 * Busca produto por ID
 * GET /estoque/produtos/:id
 */
export function getProduto(id) {
  return api.get(`/estoque/produtos/${id}`)
}

/**
 * Cria novo produto
 * POST /estoque/produtos
 * body: { sku, nome, categoria, preco, custo, estoque_inicial, minimo }
 */
export function createProduto(data) {
  return api.post('/estoque/produtos', data)
}

/**
 * Atualiza produto
 * PUT /estoque/produtos/:id
 */
export function updateProduto(id, data) {
  return api.put(`/estoque/produtos/${id}`, data)
}

/**
 * Remove produto
 * DELETE /estoque/produtos/:id
 */
export function deleteProduto(id) {
  return api.delete(`/estoque/produtos/${id}`)
}

// ─── Movimentações ────────────────────────────────────────────────────────────

/**
 * Lista movimentações com filtros opcionais
 * GET /estoque/movimentos?produto_id=1&tipo=entrada&de=2026-01-01&ate=2026-03-31
 */
export function getMovimentos(params = {}) {
  return api.get('/estoque/movimentos', params)
}

/**
 * Registra nova movimentação (entrada, saída ou ajuste)
 * POST /estoque/movimentos
 * body: { produto_id, tipo, qtd, obs }
 */
export function createMovimento(data) {
  return api.post('/estoque/movimentos', data)
}

// ─── KPIs / Resumo ────────────────────────────────────────────────────────────

/**
 * Retorna métricas do estoque
 * GET /estoque/resumo
 * → { total_skus, total_unidades, valor_total, alertas }
 */
export function getResumoEstoque() {
  return api.get('/estoque/resumo')
}
