import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { login as loginApi, getMe, logoutApi } from '../services/authService'
import { setAuthToken, invalidateCache } from '../services/api'
import { useIdleTimer } from './useIdleTimer'
import { C } from '../constants/theme'

const AuthContext = createContext(null)

const IDLE_TIMEOUT_MS  = 5 * 60 * 1000   // 5 minutos
const WARN_BEFORE_MS   = 30 * 1000        // aviso 30 s antes

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [showIdleWarn, setShowIdleWarn] = useState(false)
  const [countdown, setCountdown]       = useState(30)
  const warnTimerRef  = useRef(null)
  const countdownRef  = useRef(null)

  // ── Ao montar, recupera sessão existente ──────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) { setLoading(false); return }

    getMe()
      .then(user => setUsuario(user))
      .catch(() => {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_usuario')
      })
      .finally(() => setLoading(false))
  }, [])

  // ── Escuta o evento 401 disparado pela api.js ─────────────────────────────
  useEffect(() => {
    const handle = () => { setUsuario(null); setError(null) }
    window.addEventListener('auth:logout', handle)
    return () => window.removeEventListener('auth:logout', handle)
  }, [])

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, senha) => {
    setError(null)
    setLoading(true)
    try {
      const res = await loginApi(email, senha)
      // Atualiza o token tanto no localStorage quanto no cache em memória do api.js
      setAuthToken(res.token)
      localStorage.setItem('auth_usuario', JSON.stringify(res.usuario))
      invalidateCache() // limpa cache de sessão anterior
      setUsuario(res.usuario)
      return res
    } catch (err) {
      setError(err.message || 'Erro ao fazer login')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    clearTimeout(warnTimerRef.current)
    clearInterval(countdownRef.current)
    setShowIdleWarn(false)
    try { await logoutApi() } catch { /* ignora */ } finally {
      setAuthToken(null) // limpa token em memória + localStorage
      localStorage.removeItem('auth_usuario')
      invalidateCache()  // limpa todo o cache ao sair
      setUsuario(null)
      setError(null)
    }
  }, [])

  // ── Aviso de inatividade iminente ─────────────────────────────────────────
  const cancelIdleWarn = useCallback(() => {
    clearTimeout(warnTimerRef.current)
    clearInterval(countdownRef.current)
    setShowIdleWarn(false)
    setCountdown(30)
  }, [])

  // Chamado pelo useIdleTimer quando o tempo de inatividade está próximo
  const handleNearIdle = useCallback(() => {
    setShowIdleWarn(true)
    setCountdown(Math.round(WARN_BEFORE_MS / 1000))

    countdownRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(countdownRef.current); return 0 }
        return c - 1
      })
    }, 1000)

    // Após o período de aviso, faz logout real
    warnTimerRef.current = setTimeout(() => {
      setShowIdleWarn(false)
      logout()
    }, WARN_BEFORE_MS)
  }, [logout])

  // ── useIdleTimer: dispara `handleNearIdle` (IDLE_TIMEOUT - WARN_BEFORE_MS) ──
  useIdleTimer(
    handleNearIdle,
    IDLE_TIMEOUT_MS - WARN_BEFORE_MS,
    !!usuario && !showIdleWarn,   // só ativo quando há sessão e o modal não está aberto
  )

  // ── Toast de aviso ────────────────────────────────────────────────────────
  const IdleWarning = showIdleWarn ? (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.65)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 16, padding: '32px 40px',
        maxWidth: 380, width: '90%',
        textAlign: 'center',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: `${C.yellow}18`, border: `1px solid ${C.yellow}40`,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, marginBottom: 20,
        }}>⏱️</div>

        <div style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 8 }}>
          Sessão prestes a expirar
        </div>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 24, lineHeight: 1.6 }}>
          Você ficou inativo por um tempo.<br />
          Sua sessão será encerrada em{' '}
          <span style={{ color: C.yellow, fontWeight: 700, fontFamily: 'monospace', fontSize: 15 }}>
            {countdown}s
          </span>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button
            onClick={cancelIdleWarn}
            style={{
              padding: '10px 24px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: C.accent, color: '#000', border: 'none', cursor: 'pointer',
              transition: 'opacity .15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Continuar sessão
          </button>
          <button
            onClick={logout}
            style={{
              padding: '10px 24px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: C.s3, color: C.muted, border: `1px solid ${C.border}`, cursor: 'pointer',
            }}
          >
            Sair agora
          </button>
        </div>
      </div>
    </div>
  ) : null

  return (
    <AuthContext.Provider value={{ usuario, loading, error, login, logout }}>
      {children}
      {IdleWarning}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  return ctx
}
