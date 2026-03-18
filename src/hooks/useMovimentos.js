import { useCallback } from 'react'
import { useAsync } from './useAsync'
import { getMovimentos, createMovimento } from '../services/estoqueService'
import { TIPO_MOV_TO_API } from '../services/api'
import { movimentos as MOCK_MOVIMENTOS } from '../data/mock'

const USE_MOCK = false // !import.meta.env.VITE_API_URL

export function useMovimentos(params = {}) {
  const fetchFn = useCallback(() => {
    if (USE_MOCK) return Promise.resolve({ data: MOCK_MOVIMENTOS, total: MOCK_MOVIMENTOS.length })
    return getMovimentos(params)
  }, [JSON.stringify(params)]) // eslint-disable-line

  const { data: response, loading, error, execute: refetch, setData: setResponse } = useAsync(fetchFn)

  const movimentos = response?.data ?? []

  const registrarMovimento = useCallback(async (data) => {
    if (USE_MOCK) {
      const novo = {
        id:          Date.now(),
        data:        new Date().toLocaleDateString('pt-BR'),
        produto:     data.produto || '—',
        tipo:        data.tipo,
        qtd:         Number(data.qtd),
        responsavel: 'Usuário',
        origem:      data.obs || 'Lançamento manual',
      }
      setResponse(prev => ({ ...prev, data: [novo, ...(prev?.data ?? [])] }))
      return novo
    }

    // Adapta payload para o contrato da API
    // Modal envia: { produto (nome), tipo (minúsculo), qtd, obs }
    // API espera:  { produto_id, tipo (MAIÚSCULO), quantidade, obs }
    const payload = {
      produto_id: data.produto_id || data.produto,   // modal novo produto enviará produto_id
      tipo:       TIPO_MOV_TO_API[data.tipo] ?? data.tipo.toUpperCase(),
      quantidade: data.tipo === 'saida'
        ? -Math.abs(Number(data.qtd))                // saída → negativo
        : Math.abs(Number(data.qtd)),
      origem: data.obs || undefined,
      obs:    data.obs || undefined,
    }

    const novo = await createMovimento(payload)
    await refetch()
    return novo
  }, [refetch, setResponse])

  return { movimentos, loading, error, refetch, registrarMovimento }
}
