import { useCallback, useEffect, useState } from 'react'
import { useAsync } from './useAsync'
import { getVendas } from '../services/vendasService'
import { getLancamentos } from '../services/financeiroService'

const USE_MOCK = false

export function useVendas(params = {}) {
  const fetchFn = useCallback(() => {
    if (USE_MOCK) return Promise.resolve({ data: [], total: 0 })
    return getVendas(params)
  }, [JSON.stringify(params)])

  const { data: response, loading, error, execute: refetch } = useAsync(fetchFn)

  const vendas = response?.data ?? []
  const pagination = {
    total: response?.total ?? 0,
    page: response?.page ?? 1,
    limit: response?.limit ?? 50,
    pages: response?.pages ?? 1
  }

  return { vendas, pagination, loading, error, refetch }
}

/** Retorna valor total e nº de transações do mês atual + mês anterior.
 *  Usa APENAS os Lançamentos RECEITA como fonte única de verdade,
 *  pois toda venda (módulo Vendas ou saída de caixa) gera um lançamento RECEITA.
 *  Somar as duas tabelas causaria contagem dupla.
 */
export function useResumoMesVendas() {
  const [resumo, setResumo] = useState({ totalMes: 0, transacoesMes: 0, totalMesAnterior: 0, loading: true, error: null })

  useEffect(() => {
    const now = new Date()

    const inicioMes    = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
    const fimMes       = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10)
    const inicioMesAnt = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 10)
    const fimMesAnt    = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().slice(0, 10)

    Promise.all([
      getLancamentos({ tipo: 'RECEITA', data_de: inicioMes,    data_ate: fimMes,    limit: 1000 }),
      getLancamentos({ tipo: 'RECEITA', data_de: inicioMesAnt, data_ate: fimMesAnt, limit: 1000 }),
    ])
      .then(([lancMes, lancAnt]) => {
        const totalMes         = (lancMes?.data ?? []).reduce((s, l) => s + l.valor, 0)
        const totalMesAnterior = (lancAnt?.data ?? []).reduce((s, l) => s + l.valor, 0)
        const transacoesMes    = lancMes?.total ?? 0

        setResumo({ totalMes, transacoesMes, totalMesAnterior, loading: false, error: null })
      })
      .catch(err => setResumo(r => ({ ...r, loading: false, error: err })))
  }, [])

  const variacao = resumo.totalMesAnterior > 0
    ? ((resumo.totalMes - resumo.totalMesAnterior) / resumo.totalMesAnterior) * 100
    : null

  return { ...resumo, variacao }
}

import { criarVenda, cancelarVenda, getResumoVendas, getRankingProdutos } from '../services/vendasService'

export function useResumoVendas(params = {}) {
  const fetchFn = useCallback(() => {
    if (USE_MOCK) return Promise.resolve({ receita: 0, total_vendas: 0, ticket_medio: 0, total_historico: 0 })
    return getResumoVendas(params)
  }, [JSON.stringify(params)]) // eslint-disable-line
  return useAsync(fetchFn)
}

export function useRankingProdutos(params = {}) {
  const fetchFn = useCallback(() => {
    if (USE_MOCK) return Promise.resolve([])
    return getRankingProdutos(params)
  }, [JSON.stringify(params)]) // eslint-disable-line
  return useAsync(fetchFn)
}

export function useCarrinho() {
  const [itens,          setItens]          = useState([])
  const [cliente,        setCliente]        = useState('')
  const [formaPagamento, setFormaPagamento] = useState('DINHEIRO')
  const [parcelas,       setParcelas]       = useState(1)
  const [desconto,       setDesconto]       = useState(0)
  const [loading,        setLoading]        = useState(false)
  const [erro,           setErro]           = useState(null)

  const adicionarItem = useCallback((produto, quantidade = 1) => {
    setItens(prev => {
      const existe = prev.find(i => i.produto_id === produto.id)
      if (existe) return prev.map(i => i.produto_id === produto.id ? { ...i, quantidade: i.quantidade + quantidade } : i)
      return [...prev, { produto_id: produto.id, nome: produto.nome, sku: produto.sku, estoque: produto.estoque, preco_unitario: Number(produto.preco), quantidade, desconto: 0 }]
    })
  }, [])

  const removerItem  = useCallback((id) => setItens(p => p.filter(i => i.produto_id !== id)), [])
  const atualizarQtd = useCallback((id, qtd) => {
    if (qtd <= 0) return removerItem(id)
    setItens(p => p.map(i => i.produto_id === id ? { ...i, quantidade: qtd } : i))
  }, [removerItem])

  const limpar = useCallback(() => {
    setItens([]); setCliente(''); setFormaPagamento('DINHEIRO'); setParcelas(1); setDesconto(0); setErro(null)
  }, [])

  const totalBruto   = itens.reduce((a, i) => a + i.preco_unitario * i.quantidade - (i.desconto ?? 0), 0)
  const totalLiquido = totalBruto - (desconto || 0)

  const finalizar = useCallback(async () => {
    if (!itens.length) { setErro('Adicione pelo menos 1 produto.'); return null }
    setLoading(true); setErro(null)
    try {
      const venda = await criarVenda({
        cliente:         cliente || undefined,
        forma_pagamento: formaPagamento,
        parcelas:        formaPagamento === 'CARTAO_CREDITO' ? parcelas : 1,
        desconto:        desconto || 0,
        itens:           itens.map(i => ({ produto_id: i.produto_id, quantidade: i.quantidade, preco_unitario: i.preco_unitario, desconto: i.desconto ?? 0 })),
      })
      limpar()
      return venda
    } catch (err) {
      setErro(err?.message || 'Erro ao registrar venda.')
      return null
    } finally {
      setLoading(false)
    }
  }, [itens, cliente, formaPagamento, parcelas, desconto, limpar])

  return { itens, cliente, formaPagamento, parcelas, desconto, totalBruto, totalLiquido, loading, erro, setCliente, setFormaPagamento, setParcelas, setDesconto, adicionarItem, removerItem, atualizarQtd, limpar, finalizar }
}
