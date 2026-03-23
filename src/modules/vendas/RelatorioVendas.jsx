import React, { useState, useContext } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { TrendingUp, ShoppingBag, DollarSign, Hash, CalendarRange } from 'lucide-react'
import { fmtBRL } from '../../utils/format'
import { Card } from '../../components/ui/Card'
import { KPI } from '../../components/ui/KPI'
import { SkeletonTable } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { useResumoVendas, useRankingProdutos } from '../../hooks/useVendas'
import { ThemeContext } from '../../contexts/ThemeContext'
import {
  Container, FilterCard, FilterRow, FilterTitleWrap, FilterGroup,
  FilterLabel, FilterInput, FilterBadge, KpiGrid, ChartsGrid, ChartCard,
  ChartHeader, ChartTitle, ChartSubtitle, EmptyChartText, TooltipWrap,
  TooltipTitle, TooltipValue, RankingCard, RankingHeader, RankingTable,
  RankingTh, RankingTd, RankingIndexBadge, RankingProductName,
  RankingProductSku, RankingTdQty, RankingTdRevenue
} from './RelatorioVendasStyles'

export function RelatorioVendas() {
  const { theme } = useContext(ThemeContext)
  const CORES = [
    theme.colors.accent, theme.colors.blue, theme.colors.yellow, 
    theme.colors.purple, theme.colors.red, '#00bcd4', '#ff9800'
  ]

  const hoje = new Date()
  const pad  = n => String(n).padStart(2, '0')
  const [filtros, setFiltros] = useState({
    data_de:  `${hoje.getFullYear()}-${pad(hoje.getMonth() + 1)}-01`,
    data_ate: `${hoje.getFullYear()}-${pad(hoje.getMonth() + 1)}-${pad(new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate())}`,
  })

  const resumo  = useResumoVendas(filtros)
  const ranking = useRankingProdutos({ ...filtros, top: 10 })

  const kpis = [
    { label: 'Receita do período',  value: fmtBRL(resumo.data?.receita ?? 0),      icon: DollarSign, color: theme.colors.accent  },
    { label: 'Total de vendas',     value: resumo.data?.total_vendas ?? 0,          icon: Hash,       color: theme.colors.blue    },
    { label: 'Ticket médio',        value: fmtBRL(resumo.data?.ticket_medio ?? 0), icon: TrendingUp, color: theme.colors.yellow  },
    { label: 'Vendas históricas',   value: resumo.data?.total_historico ?? 0,       icon: ShoppingBag, color: theme.colors.purple },
  ]

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    return (
      <TooltipWrap>
        <TooltipTitle>{payload[0]?.payload?.nome}</TooltipTitle>
        <TooltipValue>{payload[0]?.value} unidades</TooltipValue>
      </TooltipWrap>
    )
  }

  return (
    <Container>

      {/* Filtro de período */}
      <FilterCard>
        <FilterRow>
          <FilterTitleWrap>
            <CalendarRange size={14} color={theme.colors.muted} />
            <span>Período</span>
          </FilterTitleWrap>

          {[['De', 'data_de'], ['Até', 'data_ate']].map(([label, key]) => (
            <FilterGroup key={key}>
              <FilterLabel>{label}</FilterLabel>
              <FilterInput
                type="date"
                value={filtros[key]}
                onChange={e => setFiltros(f => ({ ...f, [key]: e.target.value }))}
              />
            </FilterGroup>
          ))}

          <FilterBadge>
            Padrão: mês atual
          </FilterBadge>
        </FilterRow>
      </FilterCard>

      {/* KPIs */}
      {resumo.loading ? (
        <KpiGrid>
          {[1,2,3,4].map(i => <Card key={i}><div style={{ height: 64 }} /></Card>)}
        </KpiGrid>
      ) : resumo.error ? (
        <Card><ErrorState error={resumo.error} onRetry={resumo.execute} /></Card>
      ) : (
        <KpiGrid>
          {kpis.map((k, i) => <KPI key={i} label={k.label} value={k.value} icon={k.icon} color={k.color} />)}
        </KpiGrid>
      )}

      {/* Gráfico + Ranking */}
      <ChartsGrid>

        {/* Gráfico de barras */}
        <ChartCard>
          <ChartHeader>
            <div>
              <ChartTitle>Top Produtos</ChartTitle>
              <ChartSubtitle>Unidades vendidas no período</ChartSubtitle>
            </div>
          </ChartHeader>

          {ranking.loading ? (
            <SkeletonTable rows={5} cols={2} />
          ) : ranking.error ? (
            <ErrorState error={ranking.error} onRetry={ranking.execute} />
          ) : !(ranking.data ?? []).length ? (
            <EmptyChartText>
              Sem dados no período selecionado.
            </EmptyChartText>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={ranking.data} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
                <XAxis
                  type="number"
                  tick={{ fill: theme.colors.muted, fontSize: 11 }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  type="category" dataKey="nome" width={120}
                  tick={{ fill: theme.colors.muted2, fontSize: 11 }}
                  axisLine={false} tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: `${theme.colors.muted}20` }} />
                <Bar dataKey="quantidade" radius={[0, 5, 5, 0]}>
                  {(ranking.data ?? []).map((_, i) => (
                    <Cell key={i} fill={CORES[i % CORES.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Tabela de ranking */}
        <RankingCard>
          <RankingHeader>
            <ChartTitle>Ranking Completo</ChartTitle>
            <ChartSubtitle>Produtos por receita gerada</ChartSubtitle>
          </RankingHeader>

          {ranking.loading ? (
            <div style={{ padding: 16 }}><SkeletonTable rows={6} cols={4} /></div>
          ) : !(ranking.data ?? []).length ? (
            <EmptyChartText>
              Sem dados no período selecionado.
            </EmptyChartText>
          ) : (
            <RankingTable>
              <thead>
                <tr>
                  {['#', 'Produto', 'Qtd', 'Receita'].map((h, i) => (
                    <RankingTh key={i} $align={i >= 2 ? 'right' : 'left'}>
                      {h}
                    </RankingTh>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(ranking.data ?? []).map((p, i) => (
                  <tr key={p.id}>
                    <RankingTd>
                      <RankingIndexBadge style={{
                        background: `${CORES[i % CORES.length]}20`,
                        color: CORES[i % CORES.length],
                      }}>
                        {i + 1}
                      </RankingIndexBadge>
                    </RankingTd>
                    <RankingTd>
                      <RankingProductName>{p.nome}</RankingProductName>
                      <RankingProductSku>{p.sku}</RankingProductSku>
                    </RankingTd>
                    <RankingTdQty>
                      {p.quantidade}
                    </RankingTdQty>
                    <RankingTdRevenue>
                      {fmtBRL(p.receita)}
                    </RankingTdRevenue>
                  </tr>
                ))}
              </tbody>
            </RankingTable>
          )}
        </RankingCard>
      </ChartsGrid>
    </Container>
  )
}
