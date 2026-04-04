import { useContext, useMemo } from 'react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend as RechartLegend,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp, TrendingDown, AlertCircle, DollarSign } from 'lucide-react'
import { KPI } from '../../../components/ui/KPI'
import { ThemeContext } from '../../../contexts/ThemeContext'
import { useCashflow, useContasPagar, useContasReceber, useDRE } from '../../../hooks/useFinanceiro'
import {
  cashflowData  as MOCK_CASHFLOW,
  contasPagar   as MOCK_PAGAR,
  contasReceber as MOCK_RECEBER,
  dreData       as MOCK_DRE,
} from '../../../data/mock'
import { fmtBRL, fmtPct } from '../../../utils/format'
import {
  KpiGrid, SectionGrid, ChartCard, CardTitle,
  DreTable, DreTr, DreTd,
  InadimLegend, InadimRow, InadimLabel, InadimBar, InadimValue,
} from './RelFinanceiroStyles'

// ─── Tooltip customizado ──────────────────────────────────────────────────────
function CfTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#1a1f2e', border: '1px solid #2a3142', borderRadius: 8,
      padding: '10px 14px', fontSize: 13,
    }}>
      <div style={{ color: '#94a3b8', marginBottom: 6, fontWeight: 600 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: {fmtBRL(p.value)}
        </div>
      ))}
    </div>
  )
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#1a1f2e', border: '1px solid #2a3142', borderRadius: 8,
      padding: '8px 14px', fontSize: 13, color: '#e2e8f0',
    }}>
      <strong>{payload[0].name}</strong>: {fmtBRL(payload[0].value)}
    </div>
  )
}

// ─── Projeção: média móvel de 3 meses → mais 3 projetados ────────────────────
function buildProjection(cashflow) {
  const hist = [...cashflow]
  const window = hist.slice(-3)
  const avgRec = window.reduce((s, r) => s + r.receitas, 0) / window.length
  const avgDesp = window.reduce((s, r) => s + r.despesas, 0) / window.length
  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  const lastMes = hist[hist.length - 1].mes
  const lastIdx = meses.indexOf(lastMes)
  const projected = [1, 2, 3].map(i => {
    const mes = meses[(lastIdx + i) % 12]
    return { mes, receitas: null, despesas: null, lucro: null, projReceitas: Math.round(avgRec), projDespesas: Math.round(avgDesp), projLucro: Math.round(avgRec - avgDesp) }
  })
  const historical = hist.map(r => ({ ...r, projReceitas: null, projDespesas: null, projLucro: null }))
  return [...historical, ...projected]
}

// ─── Categoria de despesas a partir de contasPagar ───────────────────────────
const CAT_COLORS = ['#4f8fff', '#00d9a8', '#f7c948', '#ff5b6b', '#a78bfa', '#fb923c']

function buildDespesasPie(pagar) {
  const map = {}
  pagar.forEach(c => {
    map[c.categoria] = (map[c.categoria] || 0) + c.valor
  })
  return Object.entries(map).map(([name, value]) => ({ name, value }))
}

// ─── Componente principal ─────────────────────────────────────────────────────
export function RelFinanceiro({ period }) {
  const { theme } = useContext(ThemeContext)

  // Deriva o mês para o DRE a partir do período selecionado (YYYY-MM)
  const mes = period?.inicio ? period.inicio.slice(0, 7) : undefined

  const { data: cashflowRaw }    = useCashflow(7)
  const { contas: pagarRaw }     = useContasPagar()
  const { contas: receberRaw }   = useContasReceber()
  const { data: dreResponse }    = useDRE(mes)

  const cashflow = cashflowRaw?.length          ? cashflowRaw             : MOCK_CASHFLOW
  const pagar    = pagarRaw?.length             ? pagarRaw                : MOCK_PAGAR
  const receber  = receberRaw?.length           ? receberRaw              : MOCK_RECEBER
  const dre      = dreResponse?.linhas?.length  ? dreResponse.linhas      : MOCK_DRE

  const projection  = useMemo(() => buildProjection(cashflow), [cashflow])
  const despesasPie = useMemo(() => buildDespesasPie(pagar), [pagar])

  // KPIs a partir do último mês
  const ultimo = cashflow[cashflow.length - 1] ?? {}
  const penult = cashflow[cashflow.length - 2] ?? {}
  const margemBruta    = dreResponse?.margem_bruta    != null
    ? dreResponse.margem_bruta / 100
    : (ultimo.receitas ? ultimo.lucro / ultimo.receitas : 0)
  const margemAnterior = penult.receitas ? penult.lucro / penult.receitas : 0
  const deltaMargem    = margemBruta - margemAnterior

  // Inadimplência
  const totalPagar    = pagar.reduce((s, c) => s + c.valor, 0)
  const vencidoPagar  = pagar.filter(c => c.status === 'vencido').reduce((s, c) => s + c.valor, 0)
  const totalReceber  = receber.reduce((s, c) => s + c.valor, 0)
  const vencidoReceber = receber.filter(c => c.status === 'vencido').reduce((s, c) => s + c.valor, 0)
  const pctInadPagar   = vencidoPagar  / totalPagar
  const pctInadReceber = vencidoReceber / totalReceber

  // Lucro Líquido do DRE
  const lucroLiq = dre.find(r => r.tipo === 'total')?.valor ?? 0

  return (
    <>
      <KpiGrid>
        <KPI label="Receita (mês atual)" value={fmtBRL(ultimo.receitas)}
          sub={`${fmtBRL(ultimo.receitas - penult.receitas)} vs mês ant.`}
          color={theme.colors.accent} icon={TrendingUp} />
        <KPI label="Lucro Líquido" value={fmtBRL(lucroLiq)}
          sub="conforme DRE" color="#00d9a8" icon={DollarSign} />
        <KPI label="Margem Bruta" value={fmtPct(margemBruta)}
          sub={`${deltaMargem >= 0 ? '+' : ''}${fmtPct(deltaMargem)} vs mês ant.`}
          color={deltaMargem >= 0 ? '#00d9a8' : '#ff5b6b'} icon={TrendingDown} />
        <KPI label="Inadimplência (A Rec.)" value={fmtPct(pctInadReceber)}
          sub={`${fmtBRL(vencidoReceber)} vencido`}
          color={pctInadReceber > 0.1 ? '#ff5b6b' : theme.colors.muted} icon={AlertCircle} />
      </KpiGrid>

      {/* Linha: Receitas + Lucro histórico + projeção */}
      <SectionGrid $cols="2fr 1fr">
        <ChartCard>
          <CardTitle>Evolução de Caixa + Projeção (3 meses)</CardTitle>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={projection} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: theme.colors.muted }} />
              <YAxis tickFormatter={v => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: theme.colors.muted }} width={38} />
              <Tooltip content={<CfTooltip />} />
              <RechartLegend wrapperStyle={{ fontSize: 12, color: theme.colors.muted }} />

              {/* Histórico */}
              <Line type="monotone" dataKey="receitas" name="Receitas" stroke={theme.colors.accent} strokeWidth={2} dot={false} connectNulls={false} />
              <Line type="monotone" dataKey="lucro" name="Lucro" stroke="#00d9a8" strokeWidth={2} dot={false} connectNulls={false} />

              {/* Projeção */}
              <Line type="monotone" dataKey="projReceitas" name="Rec. proj." stroke={theme.colors.accent} strokeWidth={2} strokeDasharray="5 4" dot={false} connectNulls={false} />
              <Line type="monotone" dataKey="projLucro" name="Lucro proj." stroke="#00d9a8" strokeWidth={2} strokeDasharray="5 4" dot={false} connectNulls={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Breakdown de despesas */}
        <ChartCard>
          <CardTitle>Despesas por Categoria</CardTitle>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={despesasPie} dataKey="value" nameKey="name"
                cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3}>
                {despesasPie.map((_, i) => (
                  <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
            {despesasPie.map((d, i) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: theme.colors.muted }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: CAT_COLORS[i % CAT_COLORS.length], flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{d.name}</span>
                <span style={{ color: theme.colors.text, fontWeight: 600 }}>{fmtBRL(d.value)}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </SectionGrid>

      <SectionGrid $cols="1fr 1fr">
        {/* Barras receitas vs despesas mensais */}
        <ChartCard>
          <CardTitle>Receitas vs Despesas — Histórico</CardTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={cashflow} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: theme.colors.muted }} />
              <YAxis tickFormatter={v => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: theme.colors.muted }} width={38} />
              <Tooltip content={<CfTooltip />} />
              <RechartLegend wrapperStyle={{ fontSize: 12, color: theme.colors.muted }} />
              <Bar dataKey="receitas" name="Receitas" fill={theme.colors.accent} radius={[4,4,0,0]} maxBarSize={32} />
              <Bar dataKey="despesas" name="Despesas" fill="#ff5b6b" radius={[4,4,0,0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Inadimplência */}
        <ChartCard>
          <CardTitle>Inadimplência</CardTitle>
          <InadimLegend>
            <InadimRow>
              <InadimLabel>A Receber vencido</InadimLabel>
              <InadimBar $pct={pctInadReceber * 100} $color="#ff5b6b" />
              <InadimValue $warn={pctInadReceber > 0.1}>{fmtPct(pctInadReceber)}</InadimValue>
            </InadimRow>
            <InadimRow>
              <InadimLabel>A Pagar vencido</InadimLabel>
              <InadimBar $pct={pctInadPagar * 100} $color="#f7c948" />
              <InadimValue $warn={pctInadPagar > 0.1}>{fmtPct(pctInadPagar)}</InadimValue>
            </InadimRow>
          </InadimLegend>

          {/* DRE simplificado */}
          <div style={{ marginTop: 20 }}>
            <CardTitle>DRE — Mês Atual</CardTitle>
            <DreTable>
              <tbody>
                {dre.map((row, i) => (
                  <DreTr key={i} $tipo={row.tipo}>
                    <DreTd $tipo={row.tipo}>{row.label}</DreTd>
                    <DreTd $tipo={row.tipo} $valor={row.valor} $right>{fmtBRL(row.valor)}</DreTd>
                  </DreTr>
                ))}
              </tbody>
            </DreTable>
          </div>
        </ChartCard>
      </SectionGrid>
    </>
  )
}
