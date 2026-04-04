import { useCallback } from 'react'
import { useAsync } from './useAsync'
import {
  getResumoFinanceiro,
  getCashflow,
  getContasPagar,
  getContasReceber,
  getDRE,
  getLancamentos,
  updateLancamento,
  deleteLancamento,
  createContaPagar,
  createContaReceber,
  pagarConta,
  receberConta,
  createLancamento,
} from '../services/financeiroService'

// Fallbacks para dev sem backend
import {
  cashflowData  as MOCK_CASHFLOW,
  contasPagar   as MOCK_PAGAR,
  contasReceber as MOCK_RECEBER,
  dreData       as MOCK_DRE,
} from '../data/mock'

const USE_MOCK = false // import.meta.env.VITE_API_URL === undefined

// ─── Resumo ───────────────────────────────────────────────────────────────────
export function useResumoFinanceiro() {
  const fetchFn = useCallback(() => {
    if (USE_MOCK) return Promise.resolve({
      receita:    53000,
      despesas:   31000,
      saldo:      22000,
      vence_7d:   contasPagarVence7d(),
    })
    return getResumoFinanceiro()
  }, [])

  return useAsync(fetchFn)
}

function contasPagarVence7d() {
  return MOCK_PAGAR
    .filter(c => c.status !== 'pago')
    .reduce((a, c) => a + c.valor, 0)
}

// ─── Cashflow ─────────────────────────────────────────────────────────────────
export function useCashflow(meses = 7) {
  const fetchFn = useCallback(() => {
    if (USE_MOCK) return Promise.resolve({ historico: MOCK_CASHFLOW, projecao: [] })
    return getCashflow({ meses })
  }, [meses])

  const { data: response, loading, error, execute: refetch } = useAsync(fetchFn)

  // API agora retorna { historico, projecao } — extrai ambos e garante retrocompat
  const historico = response?.historico ?? (Array.isArray(response) ? response : null)
  const projecao  = response?.projecao  ?? []

  return { data: historico, projecao, loading, error, refetch }
}

// ─── Contas a Pagar ───────────────────────────────────────────────────────────
export function useContasPagar() {
  const fetchFn = useCallback(() => {
    if (USE_MOCK) return Promise.resolve({ data: MOCK_PAGAR, total: MOCK_PAGAR.length })
    return getContasPagar()
  }, [])

  const { data: response, loading, error, execute: refetch, setData: setResponse } = useAsync(fetchFn)

  const contas = response?.data ?? []
  const totalPendente = contas.filter(c => c.status !== 'pago').reduce((a, c) => a + c.valor, 0)

  const pagar = useCallback(async (id) => {
    if (USE_MOCK) {
      setResponse(prev => ({
        ...prev,
        data: prev.data.map(c => c.id === id ? { ...c, status: 'pago' } : c),
      }))
      return
    }
    await pagarConta(id)
    await refetch()
  }, [refetch, setResponse])

  return { contas, totalPendente, loading, error, refetch, pagar }
}

// ─── Contas a Receber ─────────────────────────────────────────────────────────
export function useContasReceber() {
  const fetchFn = useCallback(() => {
    if (USE_MOCK) return Promise.resolve({ data: MOCK_RECEBER, total: MOCK_RECEBER.length })
    return getContasReceber()
  }, [])

  const { data: response, loading, error, execute: refetch, setData: setResponse } = useAsync(fetchFn)

  const contas = response?.data ?? []
  const totalPendente = contas.filter(c => c.status !== 'recebido').reduce((a, c) => a + c.valor, 0)

  const receber = useCallback(async (id) => {
    if (USE_MOCK) {
      setResponse(prev => ({
        ...prev,
        data: prev.data.map(c => c.id === id ? { ...c, status: 'recebido' } : c),
      }))
      return
    }
    await receberConta(id)
    await refetch()
  }, [refetch, setResponse])

  return { contas, totalPendente, loading, error, refetch, receber }
}

// ─── DRE ──────────────────────────────────────────────────────────────────────
export function useDRE(mes) {
  const fetchFn = useCallback(() => {
    if (USE_MOCK) return Promise.resolve({
      linhas:            MOCK_DRE,
      margem_bruta:      65.3,
      margem_liquida:    39.8,
      ticket_medio:      187,
      total_transacoes:  283,
    })
    return getDRE(mes ? { mes } : {})
  }, [mes])

  return useAsync(fetchFn)
}

// ─── Lançamentos (lista) ────────────────────────────────────────────────────────
export function useLancamentos(params = {}) {
  const fetchFn = useCallback(() => {
    if (USE_MOCK) return Promise.resolve({ data: [], total: 0 })
    return getLancamentos(params)
  }, [JSON.stringify(params)]) // eslint-disable-line

  const { data: response, loading, error, execute: refetch, setData: setResponse } = useAsync(fetchFn)
  const lancamentos = response?.data ?? []

  const criar = useCallback(async (data) => {
    if (USE_MOCK) {
      const novo = { id: Date.now(), ...data }
      setResponse(prev => ({ ...prev, data: [novo, ...(prev?.data ?? [])] }))
      return novo
    }
    const novo = await createLancamento(data)
    // Espelha em contas a pagar/receber para aparecer nas abas corretas
    const isReceita = (data.tipo || '').toUpperCase() === 'RECEITA'
    const vencimento = data.data || new Date().toISOString().split('T')[0]
    if (isReceita) {
      await createContaReceber({ descricao: data.descricao, valor: data.valor, vencimento, obs: data.obs }).catch(() => null)
    } else {
      await createContaPagar({ descricao: data.descricao, valor: data.valor, vencimento, categoria_id: data.categoria_id, obs: data.obs }).catch(() => null)
    }
    await refetch()
    return novo
  }, [refetch, setResponse])

  const editar = useCallback(async (id, data) => {
    if (USE_MOCK) {
      setResponse(prev => ({ ...prev, data: prev.data.map(l => l.id === id ? { ...l, ...data } : l) }))
      return
    }
    await updateLancamento(id, data)
    await refetch()
  }, [refetch, setResponse])

  const remover = useCallback(async (id) => {
    if (USE_MOCK) {
      setResponse(prev => ({ ...prev, data: prev.data.filter(l => l.id !== id) }))
      return
    }
    await deleteLancamento(id)
    await refetch()
  }, [refetch, setResponse])

  return { lancamentos, total: response?.total ?? 0, loading, error, refetch, criar, editar, remover }
}

// Compatibilidade retroativa
export function useLancamento() {
  const { criar, loading, error } = useLancamentos()
  return { loading, error, criar }
}
