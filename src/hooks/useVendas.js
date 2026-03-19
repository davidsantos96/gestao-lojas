import { useCallback, useEffect, useState } from 'react'
import { useAsync } from './useAsync'
import { getVendas } from '../services/vendasService'
import { getLancamentos } from '../services/financeiroService'

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

/** Retorna valor total e nº de transações do mês atual + mês anterior.
 *  Usa APENAS os Lançamentos RECEITA como fonte única de verdade,
 *  pois toda venda (módulo Vendas ou saída de caixa) gera um lançamento RECEITA.
 *  Somar as duas tabelas causaria contagem dupla.
 */
export function useResumoMesVendas() {
  const [resumo, setResumo] = useState({ totalMes: 0, transacoesMes: 0, totalMesAnterior: 0, loading: true, error: null })

  useEffect(() => {
    const now = new Date()

    const inicioMes    = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
    const fimMes       = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10)
    const inicioMesAnt = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 10)
    const fimMesAnt    = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().slice(0, 10)

    Promise.all([
      getLancamentos({ tipo: 'RECEITA', data_de: inicioMes,    data_ate: fimMes,    limit: 1000 }),
      getLancamentos({ tipo: 'RECEITA', data_de: inicioMesAnt, data_ate: fimMesAnt, limit: 1000 }),
    ])
      .then(([lancMes, lancAnt]) => {
        const totalMes         = (lancMes?.data ?? []).reduce((s, l) => s + l.valor, 0)
        const totalMesAnterior = (lancAnt?.data ?? []).reduce((s, l) => s + l.valor, 0)
        const transacoesMes    = lancMes?.total ?? 0

        setResumo({ totalMes, transacoesMes, totalMesAnterior, loading: false, error: null })
      })
      .catch(err => setResumo(r => ({ ...r, loading: false, error: err })))
  }, [])

  const variacao = resumo.totalMesAnterior > 0
    ? ((resumo.totalMes - resumo.totalMesAnterior) / resumo.totalMesAnterior) * 100
    : null

  return { ...resumo, variacao }
}
