import { useContext, useMemo, useState } from 'react'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import { TrendingUp, DollarSign, ShoppingBag, Percent, ArrowUpDown } from 'lucide-react'
import { ThemeContext } from '../../../contexts/ThemeContext'
import { useCashflow } from '../../../hooks/useFinanceiro'
import { KPI } from '../../../components/ui/KPI'
import { SkeletonKPI } from '../../../components/ui/Skeleton'
import { Card } from '../../../components/ui/Card'
import { ChartTooltip } from '../../../components/ui/ChartTooltip'
import { Pagination } from '../../../components/ui/Pagination'
import { usePagination } from '../../../hooks/usePagination'
import { fmtBRL, fmtPct } from '../../../utils/format'
import {
  KpiGrid, SectionGrid, SectionTitle, SubTitle, LegendRow, LegendDot,
  TableWrap, Table, Th, Td, Tr, RankBadge, ProductName, ProductSku,
  SortArrow, MargemBar, MargemTrack, MargemFill,
} from './RelVendasStyles'

// Mock fallback — top produtos (→RH-4: useRankingProdutos retorna [] no mock)
// Derivado dos produtos do mock com volumes sintéticos realistas
import { cashflowData as MOCK_CASHFLOW, produtos as MOCK_PRODS } from '../../../data/mock'

const MOCK_QTD = { 1: 55, 2: 48, 3: 22, 4: 42, 5: 38, 6: 18, 7: 29, 8: 61, 9: 24, 10: 33 }

function buildMockRanking(prods) {
  return prods
    .map(p => ({
      id:        p.id,
      nome:      p.nome,
      sku:       p.sku,
      categoria: p.categoria,
      qtd:       MOCK_QTD[p.id] ?? 10,
      receita:   (MOCK_QTD[p.id] ?? 10) * p.preco,
      margem:    ((p.preco - p.custo) / p.preco) * 100,
    }))
    .sort((a, b) => b.receita - a.receita)
}

// Adapter preset → slice de cashflow por índice (→RD-4: datas são strings 'Mes', não Date)
function sliceByPreset(data, preset) {
  if (!data?.length) return []
  const n = { '7d': 2, '30d': 3, '90d': 5, '12m': 7 }[preset] ?? 3
  return data.slice(-n)
}

// Sortable columns config
const SORT_COLS = [
  { key: 'receita', label: 'Receita'  },
  { key: 'qtd',     label: 'Vendas'   },
  { key: 'margem',  label: 'Margem %' },
]

export function RelVendas({ period }) {
  const { theme } = useContext(ThemeContext)

  const [sortBy,  setSortBy]  = useState('receita')
  const [sortAsc, setSortAsc] = useState(false)
  // ── Dados ─────────────────────────────────────────────────────────────────
  const { data: cashflowRaw, loading } = useCashflow(7)
  const cashflow = cashflowRaw?.length ? cashflowRaw : MOCK_CASHFLOW
  const chartData = useMemo(() => sliceByPreset(cashflow, period.preset), [cashflow, period.preset])

  // KPIs derivados do período selecionado
  const kpis = useMemo(() => {
    if (!chartData.length) return { receita: 0, prevReceita: 0, ticket: 0, margem: 0 }
    const atual    = chartData[chartData.length - 1]
    const anterior = chartData[chartData.length - 2] ?? {}
    const receitaTotal  = chartData.reduce((s, m) => s + m.receitas, 0)
    const despesaTotal  = chartData.reduce((s, m) => s + m.despesas, 0)
    return {
      receita:     receitaTotal,
      prevReceita: anterior.receitas ?? 0,
      ticket:      receitaTotal / Math.max(chartData.length * 42, 1), // proxy: ~42 vendas/mês
      margem:      receitaTotal > 0 ? ((receitaTotal - despesaTotal) / receitaTotal) * 100 : 0,
    }
  }, [chartData])

  // Comparativo atual vs anterior (para o BarChart)
  const comparativo = useMemo(() => {
    if (chartData.length < 2) return []
    const slice = chartData.slice(-2)
    return slice.map((m, i) => ({
      ...m,
      label: i === slice.length - 1 ? 'Atual' : 'Anterior',
    }))
  }, [chartData])

  // Top produtos ordenados
  const ranking = useMemo(() => {
    const base = buildMockRanking(MOCK_PRODS)
    const sorted = [...base].sort((a, b) =>
      sortAsc ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]
    )
    return sorted
  }, [sortBy, sortAsc])

  const rankingPagination = usePagination(ranking)

  function handleSort(col) {
    if (sortBy === col) setSortAsc(v => !v)
    else { setSortBy(col); setSortAsc(false) }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* KPIs */}
      <KpiGrid>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonKPI key={i} />)
          : <>
              <KPI
                label="Receita do período"
                value={fmtBRL(kpis.receita)}
                sub="acumulado nos meses"
                color={theme.colors.accent}
                icon={DollarSign}
              />
              <KPI
                label="Mês anterior"
                value={fmtBRL(kpis.prevReceita)}
                sub="último período registrado"
                color={theme.colors.blue}
                icon={TrendingUp}
              />
              <KPI
                label="Ticket médio (proxy)"
                value={fmtBRL(kpis.ticket)}
                sub="receita ÷ vendas estimadas"
                color={theme.colors.yellow}
                icon={ShoppingBag}
              />
              <KPI
                label="Margem do período"
                value={fmtPct(kpis.margem)}
                sub="(receita − despesas) / receita"
                color={theme.colors.purple}
                icon={Percent}
              />
            </>
        }
      </KpiGrid>

      {/* Charts */}
      <SectionGrid>
        {/* LineChart — Evolução de Receita */}
        <Card style={{ padding: 24 }}>
          <SectionTitle>
            Evolução de Receita
            <LegendRow>
              <span><LegendDot $color={theme.colors.accent} />Receitas</span>
              <span><LegendDot $color={theme.colors.yellow} />Lucro</span>
            </LegendRow>
          </SectionTitle>

          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} vertical={false} />
              <XAxis
                dataKey="mes"
                tick={{ fill: theme.colors.muted, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: theme.colors.muted, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `R$${v / 1000}k`}
              />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone"
                dataKey="receitas"
                name="Receitas"
                stroke={theme.colors.accent}
                strokeWidth={2}
                dot={{ r: 4, fill: theme.colors.accent }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="lucro"
                name="Lucro"
                stroke={theme.colors.yellow}
                strokeWidth={2}
                dot={{ r: 4, fill: theme.colors.yellow }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* BarChart — Comparativo */}
        <Card style={{ padding: 24 }}>
          <SectionTitle>
            Comparativo de Períodos
            <SubTitle>Último mês vs anterior</SubTitle>
          </SectionTitle>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={comparativo} barGap={6} margin={{ top: 4, right: 4, bottom: 0, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: theme.colors.muted, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: theme.colors.muted, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `R$${v / 1000}k`}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar
                dataKey="receitas"
                name="Receitas"
                fill={theme.colors.accent}
                radius={[4, 4, 0, 0]}
                barSize={32}
                fillOpacity={0.85}
              />
              <Bar
                dataKey="despesas"
                name="Despesas"
                fill={theme.colors.blue}
                radius={[4, 4, 0, 0]}
                barSize={32}
                fillOpacity={0.85}
              />
              <Bar
                dataKey="lucro"
                name="Lucro"
                fill={theme.colors.yellow}
                radius={[4, 4, 0, 0]}
                barSize={32}
                fillOpacity={0.85}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </SectionGrid>

      {/* Tabela top produtos */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 20px 0' }}>
          <SectionTitle>
            Ranking de Produtos
            <span style={{ fontSize: 11, color: theme.colors.muted, fontWeight: 400, marginLeft: 4 }}>
              clique no cabeçalho para ordenar
            </span>
          </SectionTitle>
        </div>

        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th style={{ width: 40 }}>#</Th>
                <Th>Produto</Th>
                <Th>Categoria</Th>
                {SORT_COLS.map(({ key, label }) => (
                  <Th key={key} $right $sortable onClick={() => handleSort(key)}>
                    {label}
                    <SortArrow $active={sortBy === key}>
                      {sortBy === key ? (sortAsc ? ' ↑' : ' ↓') : ' ↕'}
                    </SortArrow>
                  </Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rankingPagination.paginatedItems.map((p, i) => {
                return (
                <Tr key={p.id}>
                  <Td>
                    <RankBadge $pos={globalIdx + 1}>{globalIdx + 1}</RankBadge>
                  </Td>
                  <Td>
                    <ProductName>{p.nome}</ProductName>
                    <ProductSku>{p.sku}</ProductSku>
                  </Td>
                  <Td style={{ color: theme.colors.muted }}>{p.categoria}</Td>
                  <Td $right style={{ fontWeight: 700 }}>{fmtBRL(p.receita)}</Td>
                  <Td $right>{p.qtd} un</Td>
                  <Td $right>
                    <MargemBar>
                      {fmtPct(p.margem)}
                      <MargemTrack>
                        <MargemFill $pct={p.margem} />
                      </MargemTrack>
                    </MargemBar>
                  </Td>
                </Tr>
                )
              })}
            </tbody>
          </Table>
          <Pagination {...rankingPagination} />
        </TableWrap>
      </Card>
    </div>
  )
}
