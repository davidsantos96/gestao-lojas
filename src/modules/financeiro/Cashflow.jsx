import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { C } from '../../constants/theme'
import { Card } from '../../components/ui/Card'
import { ChartTooltip } from '../../components/ui/ChartTooltip'
import { SkeletonTable } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'

const LEGEND = [
  { key: 'receitas', label: 'Receitas', color: C.accent },
  { key: 'despesas', label: 'Despesas', color: C.blue   },
  { key: 'lucro',    label: 'Lucro',    color: C.yellow  },
]

export function Cashflow({ data, loading, error, onRefetch }) {
  return (
    <Card style={{ padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Receitas vs Despesas — Últimos 7 meses</span>
        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: C.muted }}>
          {LEGEND.map(({ key, label, color }) => (
            <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 3, background: color, display: 'inline-block', borderRadius: 2 }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {loading && <div style={{ height: 280 }}><SkeletonTable rows={5} cols={4} /></div>}
      {error   && <ErrorState error={error} onRetry={onRefetch} />}

      {!loading && !error && data?.length && (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} barGap={4} margin={{ top: 0, right: 0, bottom: 0, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
            <XAxis dataKey="mes" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `R$${v / 1000}k`} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="receitas" name="Receitas" fill={C.accent} radius={[4, 4, 0, 0]} barSize={20} fillOpacity={0.85} />
            <Bar dataKey="despesas" name="Despesas" fill={C.blue}   radius={[4, 4, 0, 0]} barSize={20} fillOpacity={0.85} />
            <Bar dataKey="lucro"    name="Lucro"    fill={C.yellow} radius={[4, 4, 0, 0]} barSize={20} fillOpacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
