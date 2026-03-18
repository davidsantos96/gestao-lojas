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
 * POST /auth/logout — invalida o token no servidor
 */
export function logoutApi() {
  return api.post('/auth/logout', {})
}

/**
 * GET /auth/me
 * → { id, nome, email, perfil, empresaId, empresaNome }
 */
export function getMe() {
  return api.get('/auth/me')
}
