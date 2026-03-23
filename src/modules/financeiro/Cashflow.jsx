import { useContext } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { ThemeContext } from '../../contexts/ThemeContext'
import { Card } from '../../components/ui/Card'
import { ChartTooltip } from '../../components/ui/ChartTooltip'
import { SkeletonTable } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import {
  ChartHeader, ChartTitle, ChartLegend, LegendItem, LegendColor
} from './RelatoriosFinanceiroStyles'

export function Cashflow({ data, loading, error, onRefetch }) {
  const { theme } = useContext(ThemeContext)

  const LEGEND = [
    { key: 'receitas', label: 'Receitas', color: theme.colors.accent },
    { key: 'despesas', label: 'Despesas', color: theme.colors.blue   },
    { key: 'lucro',    label: 'Lucro',    color: theme.colors.yellow  },
  ]

  return (
    <Card style={{ padding: 28 }}>
      <ChartHeader>
        <ChartTitle>Receitas vs Despesas — Últimos 7 meses</ChartTitle>
        <ChartLegend>
          {LEGEND.map(({ key, label, color }) => (
            <LegendItem key={key}>
              <LegendColor $color={color} />
              {label}
            </LegendItem>
          ))}
        </ChartLegend>
      </ChartHeader>

      {loading && <div style={{ height: 280 }}><SkeletonTable rows={5} cols={4} /></div>}
      {error   && <ErrorState error={error} onRetry={onRefetch} />}

      {!loading && !error && data?.length > 0 && (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} barGap={4} margin={{ top: 0, right: 0, bottom: 0, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} vertical={false} />
            <XAxis dataKey="mes" tick={{ fill: theme.colors.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: theme.colors.muted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `R$${v / 1000}k`} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="receitas" name="Receitas" fill={theme.colors.accent} radius={[4, 4, 0, 0]} barSize={20} fillOpacity={0.85} />
            <Bar dataKey="despesas" name="Despesas" fill={theme.colors.blue}   radius={[4, 4, 0, 0]} barSize={20} fillOpacity={0.85} />
            <Bar dataKey="lucro"    name="Lucro"    fill={theme.colors.yellow} radius={[4, 4, 0, 0]} barSize={20} fillOpacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}

