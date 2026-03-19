import { api } from './api'

export function getVendas(params = {}) {
  return api.get('/vendas', params)
}
