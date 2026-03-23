import { api } from './api'

const MOCK_USER = {
  id: 999,
  nome: 'Usuário de Teste (Mock QA)',
  email: 'seu@email.com',
  perfil: 'admin',
  empresaId: 'empresa-demo',
  empresaNome: 'Empresa Teste QA'
}

export async function login(email, senha) {
  try {
    const res = await api.post('/auth/login', { email, senha })
    return res
  } catch (error) {
    if (error.status === 404 || error.message.includes('Sem conexão')) {
      console.warn('⚠️ [QA] Backend indisponível ou rota de auth 404. Forçando Login Mock...')
      return { token: 'mock-jwt-token-123', usuario: { ...MOCK_USER, email } }
    }
    throw error
  }
}

export async function logoutApi() {
  try {
    return await api.post('/auth/logout', {})
  } catch (e) {
    console.warn('⚠️ [QA] Logout Mock bypass...')
    return true
  }
}

export async function getMe() {
  try {
    return await api.get('/auth/me')
  } catch (error) {
    if (error.status === 404 || error.message.includes('Sem conexão')) {
      console.warn('⚠️ [QA] Backend indisponível. Retornando Mock User getMe...')
      return MOCK_USER
    }
    throw error
  }
}
