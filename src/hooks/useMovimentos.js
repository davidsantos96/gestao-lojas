import { useCallback } from 'react'
import { useAsync } from './useAsync'
import { getMovimentos, createMovimento } from '../services/estoqueService'
import { movimentos as MOCK_MOVIMENTOS } from '../data/mock'

const USE_MOCK = import.meta.env.VITE_API_URL === undefined

/**
 * Hook para listagem e registro de movimentações de estoque.
 *
 * @param {Object} params  Filtros opcionais: produto_id, tipo, de, ate
 */
export function useMovimentos(params = {}) {
  const fetchFn = useCallback(() => {
    if (USE_MOCK) return Promise.resolve({ data: MOCK_MOVIMENTOS, total: MOCK_MOVIMENTOS.length })
    return getMovimentos(params)
  }, [JSON.stringify(params)]) // eslint-disable-line react-hooks/exhaustive-deps

  const {
    data: response,
    loading,
    error,
    execute: refetch,
    setData: setResponse,
  } = useAsync(fetchFn)

  const movimentos = response?.data ?? []

  /**
   * Registra uma nova movimentação e atualiza a lista localmente.
   * @param {{ produto_id, tipo, qtd, obs }} data
   */
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
      setResponse((prev) => ({
        ...prev,
        data: [novo, ...(prev?.data ?? [])],
      }))
      return novo
    }

    const novo = await createMovimento(data)
    await refetch()
    return novo
  }, [refetch, setResponse])

  return { movimentos, loading, error, refetch, registrarMovimento }
}
