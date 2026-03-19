import { useEffect, useRef, useCallback } from 'react'

const IDLE_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click']

/**
 * Chama `onIdle` depois de `timeoutMs` ms sem atividade do usuário.
 * Reinicia o contador a cada evento listado em IDLE_EVENTS.
 *
 * @param {() => void} onIdle   - Callback chamado ao atingir o tempo limite
 * @param {number}     timeoutMs - Tempo de inatividade em milissegundos (padrão: 5 min)
 * @param {boolean}    enabled   - Ativa/desativa o timer (útil quando não há sessão)
 */
export function useIdleTimer(onIdle, timeoutMs = 5 * 60 * 1000, enabled = true) {
  const timerRef    = useRef(null)
  const onIdleRef   = useRef(onIdle)

  // Mantém a referência do callback sempre atualizada sem re-registrar eventos
  useEffect(() => { onIdleRef.current = onIdle }, [onIdle])

  const reset = useCallback(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => onIdleRef.current(), timeoutMs)
  }, [timeoutMs])

  useEffect(() => {
    if (!enabled) {
      clearTimeout(timerRef.current)
      return
    }

    // Inicia o contador imediatamente ao ativar
    reset()

    IDLE_EVENTS.forEach(evt => window.addEventListener(evt, reset, { passive: true }))

    return () => {
      clearTimeout(timerRef.current)
      IDLE_EVENTS.forEach(evt => window.removeEventListener(evt, reset))
    }
  }, [enabled, reset])
}
