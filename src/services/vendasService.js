import { api } from './api'

export function getVendas(params = {}) {
  return api.get('/vendas', params)
}

export const FORMAS_PAGAMENTO = [
  { value: 'DINHEIRO',       label: 'Dinheiro'       },
  { value: 'PIX',            label: 'Pix'            },
  { value: 'CARTAO_DEBITO',  label: 'Cartão Débito'  },
  { value: 'CARTAO_CREDITO', label: 'Cartão Crédito' },
  { value: 'BOLETO',         label: 'Boleto'         },
  { value: 'OUTRO',          label: 'Outro'          },
]

export function criarVenda(data)       { return api.post('/vendas', data)              }
export function getVenda(id)           { return api.get(`/vendas/${id}`)               }
export function cancelarVenda(id)      { return api.patch(`/vendas/${id}/cancelar`)    }
export function getResumoVendas(p={})  { return api.get('/vendas/resumo', p)           }
export function getRankingProdutos(p={}){ return api.get('/vendas/ranking-produtos', p) }
