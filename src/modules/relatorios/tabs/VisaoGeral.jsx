import { useContext, useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  TrendingUp, Percent, Wallet, AlertTriangle,
  Package, CheckCircle,
} from 'lucide-react'
import { ThemeContext } from '../../../contexts/ThemeContext'
import { useCashflow, useContasPagar, useContasReceber } from '../../../hooks/useFinanceiro'
import { useProdutos } from '../../../hooks/useProdutos'
import { KPI } from '../../../components/ui/KPI'
import { SkeletonKPI } from '../../../components/ui/Skeleton'
import { Card } from '../../../components/ui/Card'
import { ChartTooltip } from '../../../components/ui/ChartTooltip'
import { fmtBRL } from '../../../utils/format'

// Mock fallback — garante UI funcional sem backend (→RH-1)
import {
  cashflowData  as MOCK_CASHFLOW,
  contasPagar   as MOCK_PAGAR,
  contasReceber as MOCK_RECEBER,
  produtos      as MOCK_PRODUTOS,
} from '../../../data/mock'

import {
  KpiGrid, ContentGrid, SectionTitle, LegendRow, LegendDot,
  AlertItem, AlertIconWrap, AlertInfo, AlertLabel, AlertSub, AlertValue,
  EmptyAlerts, DeltaBadge,
} from './VisaoGeralStyles'

// ── Helpers ───────────────────────────────────────────────────────────────────

function deltaPct(current, previous) {
  if (!previous) return null
  return ((current - previous) / previous) * 100
}

// Adapter period.preset → meses (→RH-3: useCashflow aceita número)
function presetToMeses(preset) {
  const map = { '7d': 1, '30d': 1, '90d': 3, '12m': 7 }
  return map[preset] ?? 2
}

// Retorna slice do cashflow baseado no preset — join por índice, não por data (→RD-4)
function sliceCashflow(data, preset) {
  if (!data?.length) return []
  const n = presetToMeses(preset)
  return data.slice(-Math.max(n, 2)) // mínimo 2 pontos para o gráfico
}

// ── Component ─────────────────────────────────────────────────────────────────

export function VisaoGeral({ period }) {
  const { theme } = useContext(ThemeContext)

  // ── Data hooks (fallback para mock quando API indisponível) ───────────────
  const { data: cashflowRaw, loading: l1 }               = useCashflow(7)
  const { contas: contasPagarRaw,   loading: l2 }        = useContasPagar()
  const { contas: contasReceberRaw, loading: l3 }        = useContasReceber()
  const { produtos: produtosRaw,    loading: l4 }        = useProdutos()

  const cashflow   = cashflowRaw?.length      ? cashflowRaw      : MOCK_CASHFLOW
  const cPagar     = contasPagarRaw?.length   ? contasPagarRaw   : MOCK_PAGAR
  const cReceber   = contasReceberRaw?.length ? contasReceberRaw : MOCK_RECEBER
  const prods      = produtosRaw?.length      ? produtosRaw      : MOCK_PRODUTOS

  // Mostrar skeleton apenas na carga inicial (antes de qualquer dado disponível)
  const initialLoad = (l1 || l4) && !cashflowRaw && !produtosRaw

  // ── KPI derivados ─────────────────────────────────────────────────────────
  const kpi = useMemo(() => {
    const atual    = cashflow[cashflow.length - 1] ?? {}
    const anterior = cashflow[cashflow.length - 2] ?? {}

    const receita     = atual.receitas  ?? 0
    const prevReceita = anterior.receitas ?? 0
    const margem      = atual.receitas ? (atual.lucro / atual.receitas) * 100 : 0
    const prevMargem  = anterior.receitas ? (anterior.lucro / anterior.receitas) * 100 : 0

    const valorEstoque = prods.reduce((s, p) => s + (p.estoque ?? 0) * (p.custo ?? 0), 0)
    const alertasCnt   = prods.filter(p => p.status !== 'ok').length

    return {
      receita,
      deltReceita: deltaPct(receita, prevReceita),
      margem,
      deltMargem: margem - prevMargem,
      valorEstoque,
      alertasCnt,
    }
  }, [cashflow, prods])

  // ── Dados do gráfico de tendência ─────────────────────────────────────────
  const chartData = useMemo(
    () => sliceCashflow(cashflow, period.preset),
    [cashflow, period.preset],
  )

  // ── Lista de alertas consolidada ──────────────────────────────────────────
  const alertas = useMemo(() => {
    const rupturas = prods
      .filter(p => p.status !== 'ok')
      .map(p => ({
        id:    `prod-${p.id}`,
        color: p.status === 'out' ? theme.colors.red    : theme.colors.yellow,
        bg:    p.status === 'out' ? 'rgba(255,91,107,.12)' : 'rgba(247,201,72,.12)',
        Icon:  Package,
        label: p.nome,
        sub:   p.status === 'out' ? 'Estoque zerado' : `Baixo — ${p.estoque} un`,
        value: p.status === 'out' ? 'ZERADO' : 'BAIXO',
      }))

    const contasVencidas = [
      ...cPagar.filter(c => c.status === 'vencido').map(c => ({
        id:    `pagar-${c.id}`,
        color: theme.colors.red,
        bg:    'rgba(255,91,107,.12)',
        Icon:  AlertTriangle,
        label: c.descricao,
        sub:   `Venceu em ${c.vencimento}`,
        value: fmtBRL(c.valor),
      })),
      ...cReceber.filter(c => c.status === 'vencido').map(c => ({
        id:    `receber-${c.id}`,
        color: theme.colors.red,
        bg:    'rgba(255,91,107,.12)',
        Icon:  AlertTriangle,
        label: c.descricao,
        sub:   `A receber — ${c.cliente ?? '—'}`,
        value: fmtBRL(c.valor),
      })),
    ]

    return [...rupturas, ...contasVencidas]
  }, [prods, cPagar, cReceber, theme])

  // ── Render helpers ────────────────────────────────────────────────────────
  function delta(val, isMargem = false) {
    if (val == null) return null
    const pos = val >= 0
    return (
      <DeltaBadge $positive={pos}>
        {pos ? '▲' : '▼'} {Math.abs(val).toFixed(1)}{isMargem ? ' pp' : '%'}
      </DeltaBadge>
    )
  }

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* KPIs */}
      <KpiGrid>
        {initialLoad
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonKPI key={i} />)
          : <>
              <KPI
                label="Receita (mês atual)"
                value={fmtBRL(kpi.receita)}
                sub={delta(kpi.deltReceita)}
                color={theme.colors.accent}
                icon={TrendingUp}
              />
              <KPI
                label="Margem Líquida"
                value={`${kpi.margem.toFixed(1)}%`}
                sub={delta(kpi.deltMargem, true)}
                color={theme.colors.purple}
                icon={Percent}
              />
              <KPI
                label="Valor em Estoque"
                value={fmtBRL(kpi.valorEstoque)}
                sub="custo × unidades"
                color={theme.colors.blue}
                icon={Wallet}
              />
              <KPI
                label="Alertas de Estoque"
                value={`${kpi.alertasCnt} produto${kpi.alertasCnt !== 1 ? 's' : ''}`}
                sub={kpi.alertasCnt > 0 ? 'requer atenção' : 'estoque saudável'}
                color={kpi.alertasCnt > 0 ? theme.colors.yellow : theme.colors.accent}
                icon={AlertTriangle}
              />
            </>
        }
      </KpiGrid>

      {/* Trend Chart + Alerts */}
      <ContentGrid>
        {/* AreaChart — Evolução de Receitas (→RC-3: cores via theme, não CSS vars) */}
        <Card style={{ padding: 24 }}>
          <SectionTitle>
            Evolução de Receitas
            <LegendRow>
              <span><LegendDot $color={theme.colors.accent} />Receitas</span>
              <span><LegendDot $color={theme.colors.yellow} />Lucro</span>
            </LegendRow>
          </SectionTitle>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 10 }}>
              <defs>
                <linearGradient id="vg-grad-receita" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={theme.colors.accent} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={theme.colors.accent} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="vg-grad-lucro" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={theme.colors.yellow} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={theme.colors.yellow} stopOpacity={0} />
                </linearGradient>
              </defs>
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
              <Area
                type="monotone"
                dataKey="receitas"
                name="Receitas"
                stroke={theme.colors.accent}
                strokeWidth={2}
                fill="url(#vg-grad-receita)"
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Area
                type="monotone"
                dataKey="lucro"
                name="Lucro"
                stroke={theme.colors.yellow}
                strokeWidth={2}
                fill="url(#vg-grad-lucro)"
                dot={false}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Painel de Alertas */}
        <Card style={{ padding: 24 }}>
          <SectionTitle>
            Alertas Ativos
            <span style={{
              fontSize: 13,
              fontWeight: 700,
              color: alertas.length > 0 ? theme.colors.red : theme.colors.accent,
            }}>
              {alertas.length}
            </span>
          </SectionTitle>

          {alertas.length === 0 && (
            <EmptyAlerts>
              <CheckCircle size={24} color={theme.colors.accent} />
              Tudo em ordem
            </EmptyAlerts>
          )}

          {alertas.map(({ id, color, bg, Icon, label, sub, value }) => (
            <AlertItem key={id}>
              <AlertIconWrap $bg={bg}>
                <Icon size={15} color={color} />
              </AlertIconWrap>
              <AlertInfo>
                <AlertLabel>{label}</AlertLabel>
                <AlertSub>{sub}</AlertSub>
              </AlertInfo>
              <AlertValue $color={color}>{value}</AlertValue>
            </AlertItem>
          ))}
        </Card>
      </ContentGrid>
    </div>
  )
}
