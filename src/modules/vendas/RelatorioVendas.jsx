import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { TrendingUp, ShoppingBag, DollarSign, Hash, CalendarRange } from 'lucide-react'
import { C } from '../../constants/theme'
import { fmtBRL } from '../../utils/format'
import { Card } from '../../components/ui/Card'
import { KPI } from '../../components/ui/KPI'
import { SkeletonTable } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { useResumoVendas, useRankingProdutos } from '../../hooks/useVendas'

const CORES = [C.accent, C.blue, C.yellow, '#b478ff', C.red, '#00bcd4', '#ff9800']

const inp = {
  padding: '9px 12px', background: 'rgba(255,255,255,.04)',
  border: `1px solid ${C.border}`, borderRadius: 9,
  color: C.text, fontSize: 12, outline: 'none',
  colorScheme: 'dark', transition: 'border-color .15s',
}
const lbl = { fontSize: 10, color: C.muted, fontFamily: 'monospace', letterSpacing: 1.5, textTransform: 'uppercase', display: 'block', marginBottom: 5 }

export function RelatorioVendas() {
  const hoje = new Date()
  const pad  = n => String(n).padStart(2, '0')
  const [filtros, setFiltros] = useState({
    data_de:  `${hoje.getFullYear()}-${pad(hoje.getMonth() + 1)}-01`,
    data_ate: `${hoje.getFullYear()}-${pad(hoje.getMonth() + 1)}-${pad(new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate())}`,
  })

  const resumo  = useResumoVendas(filtros)
  const ranking = useRankingProdutos({ ...filtros, top: 10 })

  const kpis = [
    { label: 'Receita do período',  value: fmtBRL(resumo.data?.receita ?? 0),      icon: DollarSign, color: C.accent  },
    { label: 'Total de vendas',     value: resumo.data?.total_vendas ?? 0,          icon: Hash,       color: C.blue    },
    { label: 'Ticket médio',        value: fmtBRL(resumo.data?.ticket_medio ?? 0), icon: TrendingUp, color: C.yellow  },
    { label: 'Vendas históricas',   value: resumo.data?.total_historico ?? 0,       icon: ShoppingBag, color: '#b478ff' },
  ]

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    return (
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 10, padding: '10px 14px', fontSize: 12,
      }}>
        <div style={{ color: C.muted, marginBottom: 4 }}>{payload[0]?.payload?.nome}</div>
        <div style={{ fontWeight: 700, color: C.accent }}>{payload[0]?.value} unidades</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Filtro de período */}
      <Card style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <CalendarRange size={14} color={C.muted} />
            <span style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>Período</span>
          </div>

          {[['De', 'data_de'], ['Até', 'data_ate']].map(([label, key]) => (
            <div key={key}>
              <label style={lbl}>{label}</label>
              <input
                type="date"
                value={filtros[key]}
                onChange={e => setFiltros(f => ({ ...f, [key]: e.target.value }))}
                style={inp}
              />
            </div>
          ))}

          <div style={{
            fontSize: 11, color: C.muted, padding: '6px 10px',
            background: C.s2, borderRadius: 7, border: `1px solid ${C.border}`,
            alignSelf: 'flex-end',
          }}>
            Padrão: mês atual
          </div>
        </div>
      </Card>

      {/* KPIs */}
      {resumo.loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[1,2,3,4].map(i => <Card key={i}><div style={{ height: 64 }} /></Card>)}
        </div>
      ) : resumo.error ? (
        <Card><ErrorState error={resumo.error} onRetry={resumo.execute} /></Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {kpis.map((k, i) => <KPI key={i} label={k.label} value={k.value} icon={k.icon} color={k.color} />)}
        </div>
      )}

      {/* Gráfico + Ranking */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Gráfico de barras */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Top Produtos</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Unidades vendidas no período</div>
            </div>
          </div>

          {ranking.loading ? (
            <SkeletonTable rows={5} cols={2} />
          ) : ranking.error ? (
            <ErrorState error={ranking.error} onRetry={ranking.execute} />
          ) : !(ranking.data ?? []).length ? (
            <div style={{ textAlign: 'center', color: C.muted, padding: '40px 0', fontSize: 13 }}>
              Sem dados no período selecionado.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={ranking.data} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
                <XAxis
                  type="number"
                  tick={{ fill: C.muted, fontSize: 11 }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  type="category" dataKey="nome" width={120}
                  tick={{ fill: C.muted2, fontSize: 11 }}
                  axisLine={false} tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,.04)' }} />
                <Bar dataKey="quantidade" radius={[0, 5, 5, 0]}>
                  {(ranking.data ?? []).map((_, i) => (
                    <Cell key={i} fill={CORES[i % CORES.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Tabela de ranking */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 18px', borderBottom: `1px solid ${C.border}`, background: C.s2 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Ranking Completo</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Produtos por receita gerada</div>
          </div>

          {ranking.loading ? (
            <div style={{ padding: 16 }}><SkeletonTable rows={6} cols={4} /></div>
          ) : !(ranking.data ?? []).length ? (
            <div style={{ textAlign: 'center', color: C.muted, padding: '40px 0', fontSize: 13 }}>
              Sem dados no período selecionado.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {['#', 'Produto', 'Qtd', 'Receita'].map((h, i) => (
                    <th key={i} style={{
                      padding: '10px 14px', textAlign: i >= 2 ? 'right' : 'left',
                      fontSize: 10, color: C.muted, fontFamily: 'monospace',
                      letterSpacing: 1.5, fontWeight: 600, textTransform: 'uppercase',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(ranking.data ?? []).map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: `1px solid ${C.border}`, transition: 'background .12s' }}>
                    <td style={{ padding: '11px 14px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 22, height: 22, borderRadius: 6,
                        background: `${CORES[i % CORES.length]}20`,
                        fontSize: 11, fontWeight: 800, color: CORES[i % CORES.length],
                      }}>
                        {i + 1}
                      </span>
                    </td>
                    <td style={{ padding: '11px 14px' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{p.nome}</div>
                      <div style={{ fontSize: 10, color: C.muted, fontFamily: 'monospace', marginTop: 2 }}>{p.sku}</div>
                    </td>
                    <td style={{ padding: '11px 14px', fontSize: 13, fontWeight: 700, color: C.muted2, textAlign: 'right' }}>
                      {p.quantidade}
                    </td>
                    <td style={{ padding: '11px 14px', fontSize: 14, fontWeight: 800, color: C.accent, textAlign: 'right' }}>
                      {fmtBRL(p.receita)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  )
}
