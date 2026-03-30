import { useContext, useMemo, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, Award, TrendingDown, AlertTriangle } from 'lucide-react'
import { KPI } from '../../../components/ui/KPI'
import { Tag } from '../../../components/ui/Tag'
import { ThemeContext } from '../../../contexts/ThemeContext'
import { clientes } from '../../../data/mock'
import { fmtBRL } from '../../../utils/format'
import {
  KpiGrid, ContentGrid, ChartCard, CardTitle, TableCard,
  TableWrap, Table, Th, Td, LtvBar, SortArrow, DonutWrap,
  DonutCenter, Legend, LegendItem, LegendDot,
} from './RelClientesStyles'

// ─── helpers ──────────────────────────────────────────────────────────────────
function parseDate(str) {
  if (!str) return null
  const [d, m, y] = str.split('/')
  return new Date(+y, +m - 1, +d)
}

const HOJE = new Date(2026, 2, 30) // data de referência fixa para o mock

// ─── RFM: score 1-5 baseado nos percentis da coleção ───────────────────────
function calcRFM(lista) {
  const enriched = lista.map(c => {
    const compras = c.historico_compras || []
    const datas   = compras.map(h => parseDate(h.data)).filter(Boolean).sort((a, b) => b - a)
    const ultima  = datas[0] || null
    const recency = ultima ? Math.floor((HOJE - ultima) / 86400000) : 9999
    const freq    = compras.length
    const monetary = compras.reduce((s, h) => s + h.valor, 0)
    return { ...c, recency, freq, monetary }
  })

  const sorted_r = [...enriched].sort((a, b) => a.recency - b.recency)
  const sorted_f = [...enriched].sort((a, b) => b.freq    - a.freq)
  const sorted_m = [...enriched].sort((a, b) => b.monetary - a.monetary)
  const rank = (arr, id) => arr.findIndex(x => x.id === id)
  const n = enriched.length

  return enriched.map(c => {
    const rScore = 5 - Math.floor(rank(sorted_r, c.id) / n * 5)
    const fScore = 5 - Math.floor(rank(sorted_f, c.id) / n * 5)
    const mScore = 5 - Math.floor(rank(sorted_m, c.id) / n * 5)
    const avg = (rScore + fScore + mScore) / 3

    let segment
    if (rScore >= 4 && fScore >= 4 && mScore >= 4) segment = 'Champion'
    else if (fScore >= 3 && mScore >= 3)            segment = 'Leal'
    else if (rScore >= 3)                            segment = 'Potencial'
    else if (rScore <= 2 && fScore >= 2)             segment = 'Em risco'
    else                                            segment = 'Perdido'

    return { ...c, rScore, fScore, mScore, rfmAvg: avg, segment }
  })
}

// ─── Tag config por segmento ───────────────────────────────────────────────
const SEG_CONFIG = {
  Champion:  { color: '#00d9a8', bg: 'rgba(0,217,168,.12)' },
  Leal:      { color: '#4f8fff', bg: 'rgba(79,143,255,.12)' },
  Potencial: { color: '#a78bfa', bg: 'rgba(167,139,250,.12)' },
  'Em risco':{ color: '#f7c948', bg: 'rgba(247,201,72,.12)' },
  Perdido:   { color: '#ff5b6b', bg: 'rgba(255,91,107,.12)' },
}

const SEG_DONUT_COLORS = ['#00d9a8', '#4f8fff', '#a78bfa', '#f7c948', '#ff5b6b']
const SEG_ORDER = ['Champion', 'Leal', 'Potencial', 'Em risco', 'Perdido']

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

  const dados = useMemo(() => calcRFM(clientes), [])

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
    const champions = dados.filter(c => c.segment === 'Champion').length
    const atRisk    = dados.filter(c => c.segment === 'Em risco' || c.segment === 'Perdido').length
    const ltvMedio  = dados.reduce((s, c) => s + c.monetary, 0) / dados.length
    return { total: dados.length, champions, atRisk, ltvMedio }
  }, [dados])

  function handleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const arrow = (key) => (
    <SortArrow $active={sortKey === key}>
      {sortDir === 'desc' || sortKey !== key ? '↓' : '↑'}
    </SortArrow>
  )

  return (
    <>
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
              {sorted.map((c, i) => {
                const cfg = SEG_CONFIG[c.segment] || SEG_CONFIG['Potencial']
                return (
                  <tr key={c.id}>
                    <Td>
                      <span style={{ color: theme.colors.muted, fontSize: 11, marginRight: 8 }}>{i + 1}</span>
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
        </TableWrap>
      </TableCard>
    </>
  )
}
