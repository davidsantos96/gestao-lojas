const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const TIMEOUT  = Number(import.meta.env.VITE_API_TIMEOUT) || 10000

// ─── Cache em memória (GET) ───────────────────────────────────────────────────
const TTL_MAP = {
  '/financeiro/resumo':    60_000,   // 1 min
  '/financeiro/cashflow':  120_000,  // 2 min
  '/financeiro/dre':       120_000,
  '/estoque/resumo':       60_000,
  '/vendas':               30_000,
  '/financeiro/lancamentos': 30_000,
  '/financeiro/categorias':  300_000, // 5 min (raramente muda)
}

const _cache = new Map()

function cacheKey(url) { return url }

function fromCache(url) {
  const entry = _cache.get(cacheKey(url))
  if (!entry) return null
  if (Date.now() > entry.expiresAt) { _cache.delete(cacheKey(url)); return null }
  return entry.data
}

function toCache(url, data) {
  const path    = url.replace(BASE_URL, '').split('?')[0]
  const ttl     = Object.entries(TTL_MAP).find(([k]) => path.startsWith(k))?.[1]
  if (!ttl) return
  _cache.set(cacheKey(url), { data, expiresAt: Date.now() + ttl })
}

export function invalidateCache(prefix = '') {
  for (const key of _cache.keys()) {
    if (!prefix || key.includes(prefix)) _cache.delete(key)
  }
}

// ─── Token em módulo (evita ler localStorage a cada request) ─────────────────
let _cachedToken = localStorage.getItem('auth_token')

window.addEventListener('auth:logout', () => { _cachedToken = null })

export function setAuthToken(token) {
  _cachedToken = token
  if (token) localStorage.setItem('auth_token', token)
  else { localStorage.removeItem('auth_token'); localStorage.removeItem('auth_usuario') }
}

// ─── Erro tipado ──────────────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message)
    this.name   = 'ApiError'
    this.status = status
    this.data   = data
  }
}

// ─── Fetch com timeout ────────────────────────────────────────────────────────
async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController()
  const timer      = setTimeout(() => controller.abort(), TIMEOUT)
  try {
    const res = await fetch(url, { ...options, signal: controller.signal })
    clearTimeout(timer)
    return res
  } catch (err) {
    clearTimeout(timer)
    if (err.name === 'AbortError') throw new ApiError('Tempo limite de requisição excedido', 408)
    throw new ApiError('Sem conexão com o servidor', 0)
  }
}

// ─── Request base ─────────────────────────────────────────────────────────────
async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`
  const isGet = !options.method || options.method === 'GET'

  // Retorna do cache sem fazer fetch
  if (isGet) {
    const cached = fromCache(url)
    if (cached) return cached
  }

  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (_cachedToken) headers['Authorization'] = `Bearer ${_cachedToken}`

  const res = await fetchWithTimeout(url, { ...options, headers })

  if (res.status === 401) {
    setAuthToken(null)
    window.dispatchEvent(new Event('auth:logout'))
  }

  if (res.status === 204 || res.status === 304) return null

  let body
  try   { body = await res.json() }
  catch { body = null }

  if (!res.ok) {
    const message = body?.message || body?.error || `Erro ${res.status}`
    throw new ApiError(message, res.status, body)
  }

  if (isGet) toCache(url, body)
  else invalidateCache() // mutação → invalida todo o cache

  return body
}

// ─── Upload multipart (para anexos) ──────────────────────────────────────────
async function upload(path, file) {
  const form = new FormData()
  form.append('file', file)

  const headers = {}
  const token   = localStorage.getItem('auth_token')
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetchWithTimeout(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: form,
  })

  let body
  try   { body = await res.json() }
  catch { body = null }

  if (!res.ok) throw new ApiError(body?.message || `Erro ${res.status}`, res.status, body)
  return body
}

// ─── Helpers HTTP ─────────────────────────────────────────────────────────────
export const api = {
  get:    (path, params) => {
    const qs = params && Object.keys(params).length
      ? '?' + new URLSearchParams(
          Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''))
        ).toString()
      : ''
    return request(`${path}${qs}`)
  },
  post:   (path, body)   => request(path, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (path, body)   => request(path, { method: 'PUT',    body: JSON.stringify(body) }),
  patch:  (path, body)   => request(path, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete: (path)         => request(path, { method: 'DELETE' }),
  upload,
}

// ─── Adaptadores de enum ──────────────────────────────────────────────────────
// API usa enums em MAIÚSCULO, frontend usa strings legíveis

export const CATEGORIA_API_TO_LABEL = {
  VESTUARIO:  'Vestuário',
  CALCADOS:   'Calçados',
  ACESSORIOS: 'Acessórios',
}

export const CATEGORIA_LABEL_TO_API = {
  'Vestuário':  'VESTUARIO',
  'Calçados':   'CALCADOS',
  'Acessórios': 'ACESSORIOS',
}

export const TIPO_MOV_TO_API = {
  entrada: 'ENTRADA',
  saida:   'SAIDA',
  ajuste:  'AJUSTE',
}
