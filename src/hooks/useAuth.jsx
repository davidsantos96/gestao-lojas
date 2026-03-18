import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { login as loginApi, getMe } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [loading, setLoading]  = useState(true)
  const [error, setError]      = useState(null)

  // Ao montar, tenta recuperar sessão existente
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      setLoading(false)
      return
    }

    getMe()
      .then(user => {
        setUsuario(user)
      })
      .catch(() => {
        // Token expirado / inválido
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_usuario')
      })
      .finally(() => setLoading(false))
  }, [])

  // Escuta o evento disparado pela api.js quando recebe 401 (token expirado)
  useEffect(() => {
    const handleLogout = () => {
      setUsuario(null)
      setError(null)
    }
    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [])

  const login = useCallback(async (email, senha) => {
    setError(null)
    setLoading(true)
    try {
      const res = await loginApi(email, senha)
      localStorage.setItem('auth_token', res.token)
      localStorage.setItem('auth_usuario', JSON.stringify(res.usuario))
      setUsuario(res.usuario)
      return res
    } catch (err) {
      setError(err.message || 'Erro ao fazer login')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_usuario')
    setUsuario(null)
    setError(null)
  }, [])

  return (
    <AuthContext.Provider value={{ usuario, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  return ctx
}
