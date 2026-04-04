import { useCallback } from 'react'
import { useAsync } from './useAsync'
import { clienteService } from '../services/clienteService'
import { getAbc } from '../services/estoqueService'
import { getVisaoGeral } from '../services/financeiroService'

// ─── Visão Geral ──────────────────────────────────────────────────────────────
export function useVisaoGeral(period) {
  const fetchFn = useCallback(() => {
    return getVisaoGeral({ inicio: period?.inicio, fim: period?.fim })
  }, [period?.inicio, period?.fim])

  return useAsync(fetchFn)
}

// ─── RFM ─────────────────────────────────────────────────────────────────────
export function useRfm(period) {
  const fetchFn = useCallback(() => {
    return clienteService.getRfm({ inicio: period?.inicio, fim: period?.fim })
  }, [period?.inicio, period?.fim])

  const { data: response, loading, error, execute: refetch } = useAsync(fetchFn)

  const dados = response?.data ?? []
  const meta  = response?.meta ?? null

  return { dados, meta, loading, error, refetch }
}

// ─── ABC ─────────────────────────────────────────────────────────────────────
export function useAbc(period) {
  const fetchFn = useCallback(() => {
    return getAbc({ inicio: period?.inicio, fim: period?.fim })
  }, [period?.inicio, period?.fim])

  const { data: response, loading, error, execute: refetch } = useAsync(fetchFn)

  const dados = response?.data ?? []
  const meta  = response?.meta ?? null

  return { dados, meta, loading, error, refetch }
}
