import { useState, useCallback, useMemo } from 'react'
import { useAsync } from './useAsync'
import {
  getProdutos,
  getProduto,
  createProduto,
  updateProduto,
  deleteProduto,
} from '../services/estoqueService'

// Fallback para dev sem backend
import { produtos as MOCK_PRODUTOS } from '../data/mock'

const USE_MOCK = import.meta.env.VITE_API_URL === undefined

/**
 * Hook principal para gestão de produtos.
 * Expõe lista filtrada, operações CRUD e estado de UI.
 */
export function useProdutos() {
  const [busca,        setBusca]        = useState('')
  const [filtroStatus, setFiltroStatus] = useState('todos')

  // ── Fetch lista ──────────────────────────────────────────────────────────
  const fetchFn = useCallback(() => {
    if (USE_MOCK) return Promise.resolve({ data: MOCK_PRODUTOS, total: MOCK_PRODUTOS.length })
    return getProdutos()
  }, [])

  const {
    data: response,
    loading,
    error,
    execute: refetch,
    setData: setResponse,
  } = useAsync(fetchFn)

  const produtos = response?.data ?? []

  // ── Filtro local (client-side) ───────────────────────────────────────────
  const produtosFiltrados = useMemo(() => {
    const q = busca.toLowerCase()
    return produtos.filter((p) => {
      const matchBusca =
        p.nome.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q)
      const matchStatus = filtroStatus === 'todos' || p.status === filtroStatus
      return matchBusca && matchStatus
    })
  }, [produtos, busca, filtroStatus])

  // ── KPIs calculados ──────────────────────────────────────────────────────
  const resumo = useMemo(() => ({
    totalSkus:    produtos.length,
    totalUnidades: produtos.reduce((a, p) => a + p.estoque, 0),
    valorTotal:   produtos.reduce((a, p) => a + p.estoque * p.custo, 0),
    alertas:      produtos.filter((p) => p.status !== 'ok').length,
  }), [produtos])

  // ── CRUD ─────────────────────────────────────────────────────────────────
  const adicionarProduto = useCallback(async (data) => {
    if (USE_MOCK) {
      const novo = { ...data, id: Date.now(), status: 'ok' }
      setResponse((prev) => ({
        ...prev,
        data: [...(prev?.data ?? []), novo],
      }))
      return novo
    }
    const novo = await createProduto(data)
    await refetch()
    return novo
  }, [refetch, setResponse])

  const editarProduto = useCallback(async (id, data) => {
    if (USE_MOCK) {
      setResponse((prev) => ({
        ...prev,
        data: prev.data.map((p) => p.id === id ? { ...p, ...data } : p),
      }))
      return
    }
    await updateProduto(id, data)
    await refetch()
  }, [refetch, setResponse])

  const removerProduto = useCallback(async (id) => {
    if (USE_MOCK) {
      setResponse((prev) => ({
        ...prev,
        data: prev.data.filter((p) => p.id !== id),
      }))
      return
    }
    await deleteProduto(id)
    await refetch()
  }, [refetch, setResponse])

  return {
    // dados
    produtos,
    produtosFiltrados,
    resumo,
    // estado
    loading,
    error,
    // filtros
    busca,
    setBusca,
    filtroStatus,
    setFiltroStatus,
    // ações
    refetch,
    adicionarProduto,
    editarProduto,
    removerProduto,
  }
}

/**
 * Hook para detalhes de um produto específico.
 */
export function useProduto(id) {
  const fetchFn = useCallback(() => {
    if (USE_MOCK) {
      const p = MOCK_PRODUTOS.find((x) => x.id === id)
      return Promise.resolve(p ?? null)
    }
    return getProduto(id)
  }, [id])

  return useAsync(fetchFn, { immediate: !!id })
}
