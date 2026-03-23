import { useContext } from 'react'
import { ThemeContext } from '../../contexts/ThemeContext'
import { fmtBRL, fmtPct } from '../../utils/format'
import { Card } from '../../components/ui/Card'
import { SkeletonKPI, Skeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import {
  DreGrid, DreTitle, DreList, DreLineStyle, DreLineSkeleton, DreLabel, DreValue,
  MetricsCol, MetricLabel, MetricValue, ProgressBarBg, ProgressBarFill, MetricSub
} from './RelatoriosFinanceiroStyles'

export function DRE({ data, loading, error, onRefetch }) {
  const { theme } = useContext(ThemeContext)

  if (error) return <ErrorState error={error} onRetry={onRefetch} />

  const DRE_COLORS = {
    receita:  theme.colors.accent,
    desconto: theme.colors.muted2,
    subtotal: theme.colors.blue,
    total:    theme.colors.accent,
  }

  const linhas   = data?.linhas            ?? []
  const metricas = [
    { label: 'Margem Bruta',   valor: data?.margem_bruta,    color: theme.colors.accent },
    { label: 'Margem Líquida', valor: data?.margem_liquida,  color: theme.colors.yellow },
  ]

  return (
    <DreGrid>
      {/* DRE table */}
      <Card style={{ padding: 28 }}>
        <DreTitle>
          DRE Simplificado — Março 2026
        </DreTitle>
        <DreList>
          {loading
            ? Array.from({ length: 9 }).map((_, i) => (
                <DreLineSkeleton key={i} $borderTop={i > 0 && i % 3 === 0}>
                  <Skeleton width="55%" height={13} />
                  <Skeleton width="25%" height={13} />
                </DreLineSkeleton>
              ))
            : linhas.map((d, i) => {
                const isSubtotal = d.tipo === 'subtotal'
                const isTotal    = d.tipo === 'total'
                const isDesconto = d.tipo === 'desconto'

                return (
                  <DreLineStyle key={i} $isSubtotal={isSubtotal} $isTotal={isTotal}>
                    <DreLabel $isSubtotal={isSubtotal} $isTotal={isTotal} $isDesconto={isDesconto}>
                      {d.label}
                    </DreLabel>
                    <DreValue $isSubtotal={isSubtotal} $isTotal={isTotal} $color={DRE_COLORS[d.tipo]}>
                      {d.valor < 0 ? `-${fmtBRL(Math.abs(d.valor))}` : fmtBRL(d.valor)}
                    </DreValue>
                  </DreLineStyle>
                )
              })
          }
        </DreList>
      </Card>

      {/* Métricas */}
      <MetricsCol>
        {metricas.map(({ label, valor, color }) => (
          loading
            ? <SkeletonKPI key={label} />
            : (
              <Card key={label} style={{ padding: 24 }}>
                <MetricLabel>{label}</MetricLabel>
                <MetricValue $color={color}>{fmtPct(valor ?? 0)}</MetricValue>
                <ProgressBarBg>
                  <ProgressBarFill $pct={Math.min(valor ?? 0, 100)} $color={color} />
                </ProgressBarBg>
              </Card>
            )
        ))}

        <Card style={{ padding: 24 }}>
          <MetricLabel>Ticket Médio</MetricLabel>
          {loading
            ? <Skeleton width="60%" height={32} />
            : <>
                <MetricValue $color={theme.colors.blue}>{fmtBRL(data?.ticket_medio ?? 0)}</MetricValue>
                <MetricSub>{data?.total_transacoes ?? 0} transações no mês</MetricSub>
              </>
          }
        </Card>
      </MetricsCol>
    </DreGrid>
  )
}

