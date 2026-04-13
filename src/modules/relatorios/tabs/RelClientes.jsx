import { useContext, useMemo, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, Award, TrendingDown, AlertTriangle, Info } from 'lucide-react'
import { KPI } from '../../../components/ui/KPI'
import { Tag } from '../../../components/ui/Tag'
import { ThemeContext } from '../../../contexts/ThemeContext'
import { useRfm } from '../../../hooks/useRelatorios'
import { Pagination } from '../../../components/ui/Pagination'
import { usePagination } from '../../../hooks/usePagination'
import { fmtBRL } from '../../../utils/format'
import {
  KpiGrid, ContentGrid, ChartCard, CardTitle, TableCard,
  TableWrap, Table, Th, Td, LtvBar, SortArrow, DonutWrap,
  DonutCenter, Legend, LegendItem, LegendDot,
} from './RelClientesStyles'

// ─── Tag config por segmento ───────────────────────────────────────────────
const SEG_CONFIG = {
  // nomes da API (português)
  'Campeão':  { color: '#00d9a8', bg: 'rgba(0,217,168,.12)' },
  'Leal':     { color: '#4f8fff', bg: 'rgba(79,143,255,.12)' },
  'Em Risco': { color: '#f7c948', bg: 'rgba(247,201,72,.12)' },
  'Dormente': { color: '#ff5b6b', bg: 'rgba(255,91,107,.12)' },
  'Novo':     { color: '#a78bfa', bg: 'rgba(167,139,250,.12)' },
  'Regular':  { color: '#6b738f', bg: 'rgba(107,115,143,.12)' },
  // aliases legados (mock local — mantidos para não quebrar se houver dados residuais)
  'Champion':  { color: '#00d9a8', bg: 'rgba(0,217,168,.12)' },
  'Potencial': { color: '#a78bfa', bg: 'rgba(167,139,250,.12)' },
  'Em risco':  { color: '#f7c948', bg: 'rgba(247,201,72,.12)' },
  'Perdido':   { color: '#ff5b6b', bg: 'rgba(255,91,107,.12)' },
}

const SEG_DONUT_COLORS = ['#00d9a8', '#4f8fff', '#a78bfa', '#f7c948', '#ff5b6b', '#6b738f']
const SEG_ORDER = ['Campeão', 'Leal', 'Novo', 'Em Risco', 'Dormente', 'Regular']

// ─── Tooltip customizado ───────────────────────────────────────────────────
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div style={{
      background: '#1a1f2e', border: '1px solid #2a3142', borderRadius: 8,
      padding: '8px 14px', fontSize: 13, color: '#e2e8f0',
    }}>
      <strong>{name}</strong>: {value} cliente{value !== 1 ? 's' : ''}
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────
export function RelClientes({ period }) {
  const { theme } = useContext(ThemeContext)
  const [sortKey, setSortKey]   = useState('monetary')
  const [sortDir, setSortDir]   = useState('desc')

  const { dados: rawDados, meta, loading } = useRfm(period)

  // Normaliza campos da API para o shape usado pelo componente
  const dados = useMemo(() => rawDados.map(c => ({
    ...c,
    id:       c.clienteId,
    rScore:   c.score_r,
    fScore:   c.score_f,
    mScore:   c.score_m,
    segment:  c.segmento,
    recency:  c.R,   // dias desde a última compra
    freq:     c.F,   // número de pedidos
    monetary: c.M,   // valor total gasto
  })), [rawDados])

  const sorted = useMemo(() => {
    return [...dados].sort((a, b) => {
      const factor = sortDir === 'desc' ? -1 : 1
      if (sortKey === 'nome')     return factor * a.nome.localeCompare(b.nome)
      if (sortKey === 'segment')  return factor * a.segment.localeCompare(b.segment)
      return factor * (a[sortKey] - b[sortKey])
    })
  }, [dados, sortKey, sortDir])

  const donutData = useMemo(() => {
    const counts = {}
    dados.forEach(c => { counts[c.segment] = (counts[c.segment] || 0) + 1 })
    return SEG_ORDER.filter(s => counts[s]).map(s => ({ name: s, value: counts[s] }))
  }, [dados])

  const maxLtv = useMemo(() => Math.max(...dados.map(c => c.monetary)), [dados])

  const kpis = useMemo(() => {
    const champions = dados.filter(c => c.segment === 'Campeão').length
    const atRisk    = dados.filter(c => c.segment === 'Em Risco' || c.segment === 'Dormente').length
    const ltvMedio  = dados.reduce((s, c) => s + c.monetary, 0) / dados.length
    return { total: dados.length, champions, atRisk, ltvMedio }
  }, [dados])

  function handleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const rfmPagination = usePagination(sorted)

  const arrow = (key) => (
    <SortArrow $active={sortKey === key}>
      {sortDir === 'desc' || sortKey !== key ? '↓' : '↑'}
    </SortArrow>
  )
  // ── Aviso de período parcial ────────────────────────────────────────────
  const periodoParcial = meta && period?.inicio && meta.periodo_real_inicio &&
    meta.periodo_real_inicio > period.inicio

  // ── EmptyState ───────────────────────────────────────────────────────────
  if (!loading && dados.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 24px', color: theme.colors.muted }}>
        <Users size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
        <div style={{ fontSize: 16, fontWeight: 600, color: theme.colors.text, marginBottom: 8 }}>
          Nenhum cliente com compras neste período
        </div>
        <div style={{ fontSize: 13 }}>
          Tente ampliar o intervalo de datas ou verifique se há vendas concluídas no período selecionado.
        </div>
      </div>
    )
  }
  return (
    <>
      {periodoParcial && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px', marginBottom: 16, borderRadius: 8,
          background: 'rgba(247,201,72,.1)', border: '1px solid rgba(247,201,72,.25)',
          fontSize: 13, color: '#f7c948',
        }}>
          <Info size={14} />
          Dados disponíveis a partir de <strong style={{ marginLeft: 4 }}>{meta.periodo_real_inicio}</strong>.
          O período solicitado não possui registros antes dessa data.
        </div>
      )}
      <KpiGrid>
        <KPI label="Total Clientes" value={kpis.total}
          sub="base ativa" color={theme.colors.accent} icon={Users} />
        <KPI label="Champions" value={kpis.champions}
          sub="alto valor recorrente" color="#00d9a8" icon={Award} />
        <KPI label="LTV Médio" value={fmtBRL(kpis.ltvMedio)}
          sub="histórico por cliente" color={theme.colors.blue} icon={TrendingDown} />
        <KPI label="Em risco / Perdido" value={kpis.atRisk}
          sub="requerem atenção" color="#ff5b6b" icon={AlertTriangle} />
      </KpiGrid>

      <ContentGrid>
        {/* Donut: distribuição por segmento */}
        <ChartCard>
          <CardTitle>Distribuição por Segmento</CardTitle>
          <DonutWrap>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {donutData.map((entry, i) => (
                    <Cell
                      key={entry.name}
                      fill={SEG_DONUT_COLORS[SEG_ORDER.indexOf(entry.name)]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <DonutCenter theme={theme}>
              <strong>{kpis.total}</strong>
              <span>clientes</span>
            </DonutCenter>
          </DonutWrap>
          <Legend>
            {donutData.map((entry, i) => (
              <LegendItem key={entry.name}>
                <LegendDot $color={SEG_DONUT_COLORS[SEG_ORDER.indexOf(entry.name)]} />
                {entry.name} ({entry.value})
              </LegendItem>
            ))}
          </Legend>
        </ChartCard>

        {/* Top 5 por LTV */}
        <ChartCard>
          <CardTitle>Top 5 — Maior LTV</CardTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[...dados].sort((a, b) => b.monetary - a.monetary).slice(0, 5).map((c, i) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 6, fontSize: 11, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: i === 0 ? '#f7c94820' : i === 1 ? '#c0c0c020' : i === 2 ? '#cd7f3220' : theme.colors.border,
                  color: i === 0 ? '#f7c948' : i === 1 ? '#b0b0b0' : i === 2 ? '#cd7f32' : theme.colors.muted,
                }}>
                  {i + 1}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: theme.colors.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.nome}
                  </div>
                  <LtvBar $pct={(c.monetary / maxLtv) * 100} $color={SEG_CONFIG[c.segment]?.color || '#4f8fff'} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: theme.colors.text }}>
                  {fmtBRL(c.monetary)}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </ContentGrid>

      {/* Tabela RFM completa */}
      <TableCard>
        <CardTitle>Ranking RFM — Todos os Clientes</CardTitle>
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th onClick={() => handleSort('nome')} $sortable>#  Nome {arrow('nome')}</Th>
                <Th onClick={() => handleSort('segment')} $sortable>Segmento {arrow('segment')}</Th>
                <Th $right onClick={() => handleSort('rScore')} $sortable>R {arrow('rScore')}</Th>
                <Th $right onClick={() => handleSort('fScore')} $sortable>F {arrow('fScore')}</Th>
                <Th $right onClick={() => handleSort('mScore')} $sortable>M {arrow('mScore')}</Th>
                <Th $right onClick={() => handleSort('freq')} $sortable>Pedidos {arrow('freq')}</Th>
                <Th $right onClick={() => handleSort('recency')} $sortable>Última compra {arrow('recency')}</Th>
                <Th $right onClick={() => handleSort('monetary')} $sortable>LTV {arrow('monetary')}</Th>
              </tr>
            </thead>
            <tbody>
              {rfmPagination.paginatedItems.map((c, i) => {
                const globalIdx = (rfmPagination.page - 1) * rfmPagination.pageSize + i
                const cfg = SEG_CONFIG[c.segment] || SEG_CONFIG['Potencial']
                return (
                  <tr key={c.id}>
                    <Td>
                      <span style={{ color: theme.colors.muted, fontSize: 11, marginRight: 8 }}>{globalIdx + 1}</span>
                      {c.nome}
                    </Td>
                    <Td>
                      <Tag color={cfg.color} bg={cfg.bg}>{c.segment}</Tag>
                    </Td>
                    <Td $right>
                      <span style={{ fontWeight: 600, color: c.rScore >= 4 ? '#00d9a8' : c.rScore <= 2 ? '#ff5b6b' : theme.colors.text }}>
                        {c.rScore}
                      </span>
                    </Td>
                    <Td $right>
                      <span style={{ fontWeight: 600, color: c.fScore >= 4 ? '#00d9a8' : c.fScore <= 2 ? '#ff5b6b' : theme.colors.text }}>
                        {c.fScore}
                      </span>
                    </Td>
                    <Td $right>
                      <span style={{ fontWeight: 600, color: c.mScore >= 4 ? '#00d9a8' : c.mScore <= 2 ? '#ff5b6b' : theme.colors.text }}>
                        {c.mScore}
                      </span>
                    </Td>
                    <Td $right>{c.freq}</Td>
                    <Td $right style={{ color: theme.colors.muted }}>
                      {c.recency === 9999 ? '—' : `${c.recency}d atrás`}
                    </Td>
                    <Td $right style={{ fontWeight: 600 }}>{fmtBRL(c.monetary)}</Td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
          <Pagination {...rfmPagination} />
        </TableWrap>
      </TableCard>
    </>
  )
}
