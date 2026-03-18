import { useState } from 'react'
import { C } from '../../constants/theme'
import { useAuth } from '../../hooks/useAuth'
import { Store, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react'

export function LoginPage() {
  const { login, error } = useAuth()
  const [email, setEmail]   = useState('')
  const [senha, setSenha]   = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, senha)
    } catch {
      setShake(true)
      setTimeout(() => setShake(false), 600)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      {/* Background animated gradient */}
      <div style={styles.bgGlow} />
      <div style={styles.bgGlow2} />

      <form
        onSubmit={handleSubmit}
        style={{
          ...styles.card,
          animation: shake ? 'shake 0.5s ease-in-out' : 'fadeIn 0.6s ease-out',
        }}
      >
        {/* Logo */}
        <div style={styles.logoWrap}>
          <div style={styles.logoCircle}>
            <Store size={28} color={C.accent} />
          </div>
          <h1 style={styles.title}>Gestão Lojas</h1>
          <p style={styles.subtitle}>Acesse sua conta para continuar</p>
        </div>

        {/* Error */}
        {error && (
          <div style={styles.errorBox}>
            <span style={{ fontSize: 13 }}>⚠️ {error}</span>
          </div>
        )}

        {/* Email */}
        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input
            id="login-email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
            style={styles.input}
            onFocus={e => e.target.style.borderColor = C.accent}
            onBlur={e => e.target.style.borderColor = C.border}
          />
        </div>

        {/* Senha */}
        <div style={styles.field}>
          <label style={styles.label}>Senha</label>
          <div style={{ position: 'relative' }}>
            <input
              id="login-senha"
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
              minLength={4}
              style={{ ...styles.input, paddingRight: 44 }}
              onFocus={e => e.target.style.borderColor = C.accent}
              onBlur={e => e.target.style.borderColor = C.border}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              style={styles.eyeBtn}
              tabIndex={-1}
            >
              {showPw ? <EyeOff size={16} color={C.muted} /> : <Eye size={16} color={C.muted} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          id="login-submit"
          type="submit"
          disabled={loading}
          style={{
            ...styles.submitBtn,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading
            ? <Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} />
            : <LogIn size={18} />
          }
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        {/* Footer */}
        <p style={styles.footer}>
          Sistema de Controle de Lojas · v0.1
        </p>
      </form>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%  { transform: translateX(-10px); }
          40%  { transform: translateX(10px); }
          60%  { transform: translateX(-6px); }
          80%  { transform: translateX(6px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%      { opacity: 0.6; transform: scale(1.05); }
        }
      `}</style>
    </div>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: C.bg,
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
  bgGlow: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${C.accent}22 0%, transparent 70%)`,
    top: '-10%',
    right: '-5%',
    animation: 'pulse 6s ease-in-out infinite',
    pointerEvents: 'none',
  },
  bgGlow2: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${C.blue}18 0%, transparent 70%)`,
    bottom: '-10%',
    left: '-5%',
    animation: 'pulse 8s ease-in-out infinite',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative',
    zIndex: 1,
    width: 400,
    padding: '44px 36px 32px',
    borderRadius: 20,
    background: `linear-gradient(145deg, ${C.surface}ee, ${C.s2}dd)`,
    border: `1px solid ${C.border}`,
    backdropFilter: 'blur(20px)',
    boxShadow: `0 24px 80px rgba(0,0,0,.5), 0 0 0 1px ${C.border}`,
  },
  logoWrap: {
    textAlign: 'center',
    marginBottom: 28,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 16,
    background: `${C.accent}18`,
    border: `1px solid ${C.accent}30`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: C.text,
    letterSpacing: -0.5,
    margin: '0 0 6px',
  },
  subtitle: {
    fontSize: 13,
    color: C.muted,
    margin: 0,
  },
  errorBox: {
    background: `${C.red}15`,
    border: `1px solid ${C.red}30`,
    borderRadius: 10,
    padding: '10px 14px',
    color: C.red,
    marginBottom: 16,
    textAlign: 'center',
  },
  field: {
    marginBottom: 18,
  },
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: C.muted2,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    fontSize: 14,
    color: C.text,
    background: C.s3,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
  },
  submitBtn: {
    width: '100%',
    padding: '13px 0',
    fontSize: 14,
    fontWeight: 600,
    color: C.bg,
    background: `linear-gradient(135deg, ${C.accent}, ${C.accentD})`,
    border: 'none',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'opacity 0.15s, transform 0.15s',
    marginTop: 6,
  },
  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: C.muted,
    marginTop: 24,
    marginBottom: 0,
  },
}
