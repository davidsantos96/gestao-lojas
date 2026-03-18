import { useState, useCallback, useMemo } from 'react'
import { useAsync } from './useAsync'
import { getProdutos, getProduto, createProduto, updateProduto, deleteProduto } from '../services/estoqueService'
import { CATEGORIA_API_TO_LABEL, CATEGORIA_LABEL_TO_API } from '../services/api'
import { produtos as MOCK_PRODUTOS } from '../data/mock'

const USE_MOCK = false // !import.meta.env.VITE_API_URL

// Normaliza produto da API para o formato do frontend
function normalizarProduto(p) {
  let status = 'ok'
  if (p.estoque === 0) status = 'out'
  else if (p.estoque <= (p.minimo || 5)) status = 'low'

  return {
    ...p,
    status,
    categoria: CATEGORIA_API_TO_LABEL[p.categoria] ?? p.categoria,
  }
}

export function useProdutos() {
  const [busca,        setBusca]        = useState('')
  const [filtroStatus, setFiltroStatus] = useState('todos')

  const fetchFn = useCallback(() => {
    if (USE_MOCK) return Promise.resolve({ data: MOCK_PRODUTOS, total: MOCK_PRODUTOS.length })
    return getProdutos()
  }, [])

  const { data: response, loading, error, execute: refetch, setData: setResponse } = useAsync(fetchFn)

  const produtos = useMemo(
    () => (response?.data ?? []).map(p => USE_MOCK ? p : normalizarProduto(p)),
    [response]
  )

  const produtosFiltrados = useMemo(() => {
    const q = busca.toLowerCase()
    return produtos.filter(p => {
      const matchBusca =
        p.nome.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.categoria ?? '').toLowerCase().includes(q) ||
        (p.cor ?? '').toLowerCase().includes(q)
      const matchStatus = filtroStatus === 'todos' || p.status === filtroStatus
      return matchBusca && matchStatus
    })
  }, [produtos, busca, filtroStatus])

  const resumo = useMemo(() => ({
    totalSkus:     produtos.length,
    totalUnidades: produtos.reduce((a, p) => a + (p.estoque ?? 0), 0),
    valorTotal:    produtos.reduce((a, p) => a + (p.estoque ?? 0) * (p.custo ?? 0), 0),
    alertas:       produtos.filter(p => p.status !== 'ok').length,
  }), [produtos])

  const adicionarProduto = useCallback(async (data) => {
    if (USE_MOCK) {
      const novo = { ...data, id: Date.now(), status: 'ok' }
      setResponse(prev => ({ ...prev, data: [...(prev?.data ?? []), novo] }))
      return novo
    }
    // Converte categoria legível → enum da API
    const payload = { ...data, categoria: CATEGORIA_LABEL_TO_API[data.categoria] ?? data.categoria }
    const novo = await createProduto(payload)
    await refetch()
    return novo
  }, [refetch, setResponse])

  const editarProduto = useCallback(async (id, data) => {
    if (USE_MOCK) {
      setResponse(prev => ({ ...prev, data: prev.data.map(p => p.id === id ? { ...p, ...data } : p) }))
      return
    }
    const payload = { ...data }
    if (payload.categoria) payload.categoria = CATEGORIA_LABEL_TO_API[payload.categoria] ?? payload.categoria
    await updateProduto(id, payload)
    await refetch()
  }, [refetch, setResponse])

  const removerProduto = useCallback(async (id) => {
    if (USE_MOCK) {
      setResponse(prev => ({ ...prev, data: prev.data.filter(p => p.id !== id) }))
      return
    }
    await deleteProduto(id)
    await refetch()
  }, [refetch, setResponse])

  return {
    produtos, produtosFiltrados, resumo,
    loading, error,
    busca, setBusca, filtroStatus, setFiltroStatus,
    refetch, adicionarProduto, editarProduto, removerProduto,
  }
}

export function useProduto(id) {
  const fetchFn = useCallback(() => {
    if (USE_MOCK) return Promise.resolve(MOCK_PRODUTOS.find(x => x.id === id) ?? null)
    return getProduto(id)
  }, [id])
  return useAsync(fetchFn, { immediate: !!id })
}
