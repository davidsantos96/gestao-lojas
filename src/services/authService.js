import { api } from './api'

/**
 * POST /auth/login
 * body: { email, senha }
 * → { token, usuario: { id, nome, email, perfil, empresaId, empresaNome } }
 */
export function login(email, senha) {
  return api.post('/auth/login', { email, senha })
}

/**
 * GET /auth/me
 * → { id, nome, email, perfil, empresaId, empresaNome }
 */
export function getMe() {
  return api.get('/auth/me')
}
