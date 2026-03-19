import { useCallback } from 'react'
import { useAsync } from './useAsync'
import { getVendas } from '../services/vendasService'

const USE_MOCK = false

export function useVendas(params = {}) {
  const fetchFn = useCallback(() => {
    if (USE_MOCK) return Promise.resolve({ data: [], total: 0 })
    return getVendas(params)
  }, [JSON.stringify(params)])

  const { data: response, loading, error, execute: refetch } = useAsync(fetchFn)

  const vendas = response?.data ?? []
  const pagination = {
    total: response?.total ?? 0,
    page: response?.page ?? 1,
    limit: response?.limit ?? 50,
    pages: response?.pages ?? 1
  }

  return { vendas, pagination, loading, error, refetch }
}
