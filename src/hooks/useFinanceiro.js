import { useCallback } from 'react'
import { useAsync } from './useAsync'
import {
  getResumoFinanceiro,
  getCashflow,
  getContasPagar,
  getContasReceber,
  getDRE,
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

const USE_MOCK = import.meta.env.VITE_API_URL === undefined

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
    if (USE_MOCK) return Promise.resolve(MOCK_CASHFLOW)
    return getCashflow({ meses })
  }, [meses])

  return useAsync(fetchFn)
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
export function useDRE() {
  const fetchFn = useCallback(() => {
    if (USE_MOCK) return Promise.resolve({
      linhas:            MOCK_DRE,
      margem_bruta:      65.3,
      margem_liquida:    39.8,
      ticket_medio:      187,
      total_transacoes:  283,
    })
    return getDRE()
  }, [])

  return useAsync(fetchFn)
}

// ─── Novo lançamento ──────────────────────────────────────────────────────────
export function useLancamento() {
  const { loading, error, execute } = useAsync(
    useCallback((data) => {
      if (USE_MOCK) return Promise.resolve({ id: Date.now(), ...data })
      return createLancamento(data)
    }, []),
    { immediate: false }
  )

  return { loading, error, criar: execute }
}
