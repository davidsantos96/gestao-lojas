import { useContext } from 'react'
import { TrendingUp, TrendingDown, Boxes, AlertTriangle, ArrowDown, ArrowUp, RefreshCw, ChevronRight } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { ThemeContext } from '../../contexts/ThemeContext'
import { fmtBRL } from '../../utils/format'
import { useProdutos } from '../../hooks/useProdutos'
import { useContasPagar, useCashflow, useResumoFinanceiro } from '../../hooks/useFinanceiro'
import { useMovimentos } from '../../hooks/useMovimentos'
import { KPI } from '../../components/ui/KPI'
import { SkeletonKPI } from '../../components/ui/Skeleton'
import { Card } from '../../components/ui/Card'
import { ChartTooltip } from '../../components/ui/ChartTooltip'
import { PainelAlertas } from './PainelAlertas'
import {
  DashboardHeader, DashboardTitleWrap, DashboardModule, DashboardTitle, RefreshBtn,
  KPIGrid, SectionGrid, CardHeader, CardTitle, SeeAllBtn, ListWrap, ListItem,
  MovIconWrap, ListInfo, ListTitle, ListSub, ListDate, FinValueItem, FinValue
} from './DashboardStyles'

export function Dashboard({ setPage }) {
  const { theme } = useContext(ThemeContext)
  const { produtos, resumo, loading: loadProd, refetch: refetchProd } = useProdutos()
  const { contas: contasPagar, loading: loadFin, refetch: refetchFin } = useContasPagar()
  const { data: cashflowData = [], loading: loadCash, execute: refetchCash } = useCashflow()
  const { movimentos, loading: loadMov, refetch: refetchMov } = useMovimentos()
  const { data: resumoFin, loading: loadResumo, execute: refetchResumo } = useResumoFinanceiro()

  const loading = loadProd || loadFin || loadCash || loadMov || loadResumo

  const handleRefresh = async () => {
    await Promise.all([refetchProd(), refetchFin(), refetchCash(), refetchMov(), refetchResumo()])
  }

  const STATUS_FIN = {
    pendente: { color: theme.colors.yellow },
    vencido:  { color: theme.colors.red },
    pago:     { color: theme.colors.accent },
  }

  return (
    <div>
      {/* Header */}
      <DashboardHeader>
        <DashboardTitleWrap>
          <DashboardModule>Visão Geral</DashboardModule>
          <DashboardTitle>Dashboard</DashboardTitle>
        </DashboardTitleWrap>
        <RefreshButton loading={loading} onClick={handleRefresh} />
      </DashboardHeader>

      {/* KPIs */}
      <KPIGrid>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonKPI key={i} />)
          : <>
            <KPI label="Receita Mar" value={fmtBRL(resumoFin?.receita || 0)} sub="↑ 15% vs fev" color={theme.colors.accent} icon={TrendingUp} />
            <KPI label="Despesas Mar" value={fmtBRL(resumoFin?.despesas || 0)} sub="↓ 3% vs fev" color={theme.colors.blue} icon={TrendingDown} />
            <KPI label="Val. Estoque" value={fmtBRL(resumo.valorTotalVenda)} sub={`${resumo.totalSkus} produtos · a preço de venda`} color={theme.colors.yellow} icon={Boxes} />
            <KPI label="Alertas" value={resumo.alertas + contasPagar.filter(c => c.status === 'vencido').length}
              sub="estoque + financeiro" color={theme.colors.red} icon={AlertTriangle} />
          </>
        }
      </KPIGrid>

      {/* Gráfico + Alertas */}
      <SectionGrid $template="3fr 2fr" $mb="16px">
        <Card style={{ padding: 24 }}>
          <CardHeader>
            <CardTitle>Fluxo de Caixa — Últimos 7 meses</CardTitle>
            <SeeAllBtn onClick={() => setPage('financeiro')}>
              Ver detalhes <ChevronRight size={12} />
            </SeeAllBtn>
          </CardHeader>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={cashflowData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.colors.accent} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={theme.colors.accent} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.colors.blue} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={theme.colors.blue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} vertical={false} />
              <XAxis dataKey="mes" tick={{ fill: theme.colors.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: theme.colors.muted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="receitas" name="Receitas" stroke={theme.colors.accent} fill="url(#gr)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="despesas" name="Despesas" stroke={theme.colors.blue} fill="url(#gb)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <PainelAlertas
          produtos={produtos}
          contasPagar={contasPagar}
          loading={loading}
          setPage={setPage}
        />
      </SectionGrid>

      {/* Movimentações + Contas a Vencer */}
      <SectionGrid>
        <Card style={{ padding: 24 }}>
          <CardHeader $mb="14px">
            <CardTitle>Últimas Movimentações</CardTitle>
            <SeeAllBtn onClick={() => setPage('estoque')}>
              Ver todas <ChevronRight size={12} />
            </SeeAllBtn>
          </CardHeader>
          <ListWrap>
            {movimentos.slice(0, 5).map(m => (
              <ListItem key={m.id}>
                <MovIconWrap $tipo={m.tipo}>
                  {m.tipo === 'entrada' ? <ArrowDown size={13} color={theme.colors.accent} />
                    : m.tipo === 'saida' ? <ArrowUp size={13} color={theme.colors.red} />
                      : <RefreshCw size={13} color={theme.colors.yellow} />}
                </MovIconWrap>
                <ListInfo>
                  <ListTitle>{m.produto}</ListTitle>
                  <ListSub>{m.origem}</ListSub>
                </ListInfo>
                <ListDate>{m.data}</ListDate>
              </ListItem>
            ))}
          </ListWrap>
        </Card>

        <Card style={{ padding: 24 }}>
          <CardHeader $mb="14px">
            <CardTitle>Contas a Vencer</CardTitle>
            <SeeAllBtn onClick={() => setPage('financeiro')}>
              Ver todas <ChevronRight size={12} />
            </SeeAllBtn>
          </CardHeader>
          <ListWrap>
            {contasPagar.filter(c => c.status !== 'pago').slice(0, 5).map(c => {
              const cfg = STATUS_FIN[c.status]
              return (
                <FinValueItem key={c.id}>
                  <div>
                    <ListTitle>{c.descricao}</ListTitle>
                    <ListSub>{c.vencimento} · {c.categoria}</ListSub>
                  </div>
                  <FinValue $color={cfg.color}>{fmtBRL(c.valor)}</FinValue>
                </FinValueItem>
              )
            })}
          </ListWrap>
        </Card>
      </SectionGrid>
    </div>
  )
}

// ─── Botão de refresh com spinner ────────────────────────────────────────────

function RefreshButton({ loading, onClick }) {
  return (
    <RefreshBtn
      onClick={onClick}
      disabled={loading}
      title="Atualizar dados"
      $loading={loading}
    >
      <RefreshCw size={14} />
      {loading ? 'Atualizando...' : 'Atualizar'}
    </RefreshBtn>
  )
}

