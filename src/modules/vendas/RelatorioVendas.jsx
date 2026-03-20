import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { TrendingUp, ShoppingBag, DollarSign, Hash } from 'lucide-react'
import { C } from '../../constants/theme'
import { fmtBRL } from '../../utils/format'
import { Card } from '../../components/ui/Card'
import { KPI } from '../../components/ui/KPI'
import { SkeletonTable } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { useResumoVendas, useRankingProdutos } from '../../hooks/useVendas'

const CORES = [C.accent, C.blue, C.yellow, '#b478ff', C.red, '#00bcd4', '#ff9800']

export function RelatorioVendas() {
  const hoje = new Date()
  const pad  = n => String(n).padStart(2, '0')
  const [filtros, setFiltros] = useState({
    data_de:  `${hoje.getFullYear()}-${pad(hoje.getMonth() + 1)}-01`,
    data_ate: `${hoje.getFullYear()}-${pad(hoje.getMonth() + 1)}-${pad(new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate())}`,
  })

  const resumo  = useResumoVendas(filtros)
  const ranking = useRankingProdutos({ ...filtros, top: 10 })

  const inp = { padding: '8px 12px', background: C.s2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 12, outline: 'none', colorScheme: 'dark' }

  const kpis = [
    { label: 'Receita do período',  value: fmtBRL(resumo.data?.receita ?? 0),       icon: DollarSign, color: C.accent  },
    { label: 'Total de vendas',     value: resumo.data?.total_vendas ?? 0,           icon: Hash,        color: C.blue    },
    { label: 'Ticket médio',        value: fmtBRL(resumo.data?.ticket_medio ?? 0),  icon: TrendingUp,  color: C.yellow  },
    { label: 'Vendas históricas',   value: resumo.data?.total_historico ?? 0,        icon: ShoppingBag, color: '#b478ff' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          {[['DE', 'data_de'], ['ATÉ', 'data_ate']].map(([label, key]) => (
            <div key={key}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 4, fontFamily: 'monospace' }}>{label}</div>
              <input type="date" value={filtros[key]} onChange={e => setFiltros(f => ({ ...f, [key]: e.target.value }))} style={inp} />
            </div>
          ))}
          <span style={{ fontSize: 12, color: C.muted }}>* Mês atual por padrão</span>
        </div>
      </Card>

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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Card>
          <div style={{ fontSize: 11, color: C.muted, fontFamily: 'monospace', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>
            Top produtos — unidades vendidas
          </div>
          {ranking.loading ? <SkeletonTable rows={5} cols={2} /> :
           ranking.error   ? <ErrorState error={ranking.error} onRetry={ranking.execute} /> :
           !(ranking.data ?? []).length ? <div style={{ textAlign: 'center', color: C.muted, padding: 32, fontSize: 13 }}>Sem dados no período.</div> : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={ranking.data} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="nome" width={120} tick={{ fill: C.muted2, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }}
                  formatter={v => [v, 'Unidades']} cursor={{ fill: 'rgba(255,255,255,.04)' }} />
                <Bar dataKey="quantidade" radius={[0, 4, 4, 0]}>
                  {(ranking.data ?? []).map((_, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card style={{ overflow: 'hidden' }}>
          <div style={{ fontSize: 11, color: C.muted, fontFamily: 'monospace', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>
            Ranking completo
          </div>
          {ranking.loading ? <SkeletonTable rows={6} cols={4} /> :
           !(ranking.data ?? []).length ? <div style={{ textAlign: 'center', color: C.muted, padding: 24, fontSize: 13 }}>Sem dados no período.</div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {['#', 'Produto', 'Qtd', 'Receita'].map((h, i) => (
                    <th key={i} style={{ padding: '8px 10px', textAlign: i >= 2 ? 'right' : 'left', fontSize: 10, color: C.muted, fontFamily: 'monospace', letterSpacing: 1, fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(ranking.data ?? []).map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: '10px', fontSize: 12, color: CORES[i % CORES.length], fontWeight: 700 }}>{i + 1}</td>
                    <td style={{ padding: '10px', fontSize: 12, color: C.text }}>
                      <div style={{ fontWeight: 600 }}>{p.nome}</div>
                      <div style={{ fontSize: 10, color: C.muted, fontFamily: 'monospace' }}>{p.sku}</div>
                    </td>
                    <td style={{ padding: '10px', fontSize: 13, fontWeight: 700, color: C.muted2, textAlign: 'right' }}>{p.quantidade}</td>
                    <td style={{ padding: '10px', fontSize: 13, fontWeight: 700, color: C.accent, textAlign: 'right' }}>{fmtBRL(p.receita)}</td>
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
