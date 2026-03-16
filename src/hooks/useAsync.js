import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Hook genérico para chamadas assíncronas.
 *
 * @param {Function} asyncFn   Função que retorna uma Promise
 * @param {Object}   options
 *   immediate  {boolean}  Executa ao montar (default: true)
 *   onSuccess  {Function} Callback ao sucesso
 *   onError    {Function} Callback ao erro
 */
export function useAsync(asyncFn, options = {}) {
  const { immediate = true, onSuccess, onError } = options

  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error,   setError]   = useState(null)

  // Evita atualizar estado em componente desmontado
  const mountedRef = useRef(true)
  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)

    try {
      const result = await asyncFn(...args)
      if (!mountedRef.current) return result
      setData(result)
      onSuccess?.(result)
      return result
    } catch (err) {
      if (!mountedRef.current) return
      setError(err)
      onError?.(err)
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [asyncFn, onSuccess, onError]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (immediate) execute()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, execute, setData }
}
