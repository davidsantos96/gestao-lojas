// ─── CSV export ───────────────────────────────────────────────────────────────
/**
 * Gera e dispara o download de um arquivo CSV.
 * @param {string[]}   headers  - Cabeçalhos da tabela
 * @param {(string|number)[][]} rows - Linhas de dados
 * @param {string}     filename - Nome do arquivo (sem extensão)
 */
export function csvExport(headers, rows, filename = 'relatorio') {
  const BOM = '\uFEFF' // BOM UTF-8 para compatibilidade com Excel
  const SEP = ';'      // Excel pt-BR usa ponto-e-vírgula como separador
  const escape = (v) => {
    const str = v == null ? '' : String(v)
    // Envolve em aspas se contiver separador, aspas ou quebra de linha
    return str.includes(SEP) || str.includes('"') || str.includes('\n')
      ? `"${str.replace(/"/g, '""')}"`
      : str
  }
  const lines = [
    headers.map(escape).join(SEP),
    ...rows.map(row => row.map(escape).join(SEP)),
  ]
  const content = BOM + lines.join('\r\n')
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── PDF via print ────────────────────────────────────────────────────────────
export function printReport() {
  window.print()
}

// ─── Dados de exportação por aba ──────────────────────────────────────────────
// Importa diretamente do mock para não depender de estado dos componentes filhos
import {
  cashflowData, produtos, movimentos,
  contasPagar, contasReceber, dreData, clientes,
} from '../data/mock'

function fmtCSV(v) {
  if (v == null) return ''
  return String(v)
}

function parseDate(str) {
  if (!str) return null
  const [d, m, y] = str.split('/')
  return new Date(+y, +m - 1, +d)
}

const HOJE = new Date(2026, 2, 30)

/**
 * Retorna { headers, rows, filename } para cada aba do módulo de Relatórios.
 * @param {string} tabKey - Chave da aba ativa
 */
export function getTabExportData(tabKey) {
  switch (tabKey) {

    case 'visao-geral':
      return {
        filename: 'relatorio-visao-geral',
        headers: ['Mês', 'Receitas (R$)', 'Despesas (R$)', 'Lucro (R$)', 'Margem (%)'],
        rows: cashflowData.map(r => [
          r.mes,
          fmtCSV(r.receitas),
          fmtCSV(r.despesas),
          fmtCSV(r.lucro),
          fmtCSV(((r.lucro / r.receitas) * 100).toFixed(1)),
        ]),
      }

    case 'vendas': {
      const ranked = [...produtos]
        .map(p => {
          const saidas = movimentos.filter(m => m.tipo === 'saida' && m.produto.toLowerCase().trim() === p.nome.toLowerCase().trim())
          const qtd    = saidas.reduce((s, m) => s + Math.abs(m.qtd), 0)
          const receita = qtd * p.preco
          const lucro   = qtd * (p.preco - p.custo)
          const margem  = p.preco > 0 ? (lucro / receita) * 100 : 0
          return { nome: p.nome, categoria: p.categoria, qtd, receita, lucro, margem }
        })
        .sort((a, b) => b.receita - a.receita)
      return {
        filename: 'relatorio-vendas',
        headers: ['Produto', 'Categoria', 'Qtd Vendida', 'Receita (R$)', 'Lucro (R$)', 'Margem (%)'],
        rows: ranked.map(r => [
          r.nome, r.categoria,
          fmtCSV(r.qtd),
          fmtCSV(r.receita.toFixed(2)),
          fmtCSV(r.lucro.toFixed(2)),
          fmtCSV(r.margem.toFixed(1)),
        ]),
      }
    }

    case 'estoque': {
      const totalValor = produtos.reduce((s, p) => s + p.estoque * p.custo, 0)
      let acum = 0
      const withAbc = [...produtos]
        .map(p => ({ ...p, valor: p.estoque * p.custo }))
        .sort((a, b) => b.valor - a.valor)
        .map(p => {
          acum += p.valor
          const pct = totalValor > 0 ? acum / totalValor : 0
          const abc  = pct <= 0.8 ? 'A' : pct <= 0.95 ? 'B' : 'C'
          return { ...p, abc }
        })
      return {
        filename: 'relatorio-estoque',
        headers: ['SKU', 'Produto', 'Categoria', 'Estoque', 'Mínimo', 'Valor (R$)', 'Curva ABC', 'Status'],
        rows: withAbc.map(p => [
          p.sku, p.nome, p.categoria,
          fmtCSV(p.estoque),
          fmtCSV(p.minimo),
          fmtCSV(p.valor.toFixed(2)),
          p.abc,
          p.status,
        ]),
      }
    }

    case 'clientes': {
      const enriched = clientes.map(c => {
        const compras  = c.historico_compras || []
        const datas    = compras.map(h => parseDate(h.data)).filter(Boolean).sort((a, b) => b - a)
        const ultima   = datas[0]
        const recency  = ultima ? Math.floor((HOJE - ultima) / 86400000) : 9999
        const freq     = compras.length
        const monetary = compras.reduce((s, h) => s + h.valor, 0)
        const n = clientes.length
        const sortedR  = [...clientes].map(cl => {
          const d2 = (cl.historico_compras || []).map(h => parseDate(h.data)).filter(Boolean).sort((a, b) => b - a)[0]
          return { id: cl.id, r: d2 ? Math.floor((HOJE - d2) / 86400000) : 9999 }
        }).sort((a, b) => a.r - b.r)
        const rRank   = sortedR.findIndex(x => x.id === c.id)
        const rScore  = 5 - Math.floor(rRank / n * 5)
        let segment   = 'Potencial'
        if (rScore >= 4 && freq >= 4) segment = 'Champion'
        else if (freq >= 3)           segment = 'Leal'
        else if (recency > 60)        segment = recency > 120 ? 'Perdido' : 'Em risco'
        return { nome: c.nome, email: c.email, cidade: c.cidade, segment, rScore, freq, recency, monetary }
      }).sort((a, b) => b.monetary - a.monetary)

      return {
        filename: 'relatorio-clientes-rfm',
        headers: ['Nome', 'E-mail', 'Cidade', 'Segmento', 'Score R', 'Pedidos', 'Última compra (dias)', 'LTV (R$)'],
        rows: enriched.map(c => [
          c.nome, c.email, c.cidade, c.segment,
          fmtCSV(c.rScore),
          fmtCSV(c.freq),
          fmtCSV(c.recency === 9999 ? '-' : c.recency),
          fmtCSV(c.monetary.toFixed(2)),
        ]),
      }
    }

    case 'financeiro':
      return {
        filename: 'relatorio-financeiro',
        headers: ['Item', 'Valor (R$)', 'Tipo'],
        rows: dreData.map(r => [r.label, fmtCSV(r.valor.toFixed(2)), r.tipo]),
      }

    default:
      return null
  }
}
