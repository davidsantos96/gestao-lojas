import { TrendingUp, TrendingDown, Boxes, AlertTriangle, ArrowDown, ArrowUp, RefreshCw, ChevronRight } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { C } from '../../constants/theme'
import { produtos, movimentos, contasPagar, cashflowData, STATUS_ESTOQUE, STATUS_FIN } from '../../data/mock'
import { fmtBRL } from '../../utils/format'
import { KPI } from '../../components/ui/KPI'
import { Card } from '../../components/ui/Card'
import { Tag } from '../../components/ui/Tag'
import { ChartTooltip } from '../../components/ui/ChartTooltip'

export function Dashboard({ setPage }) {
  const totalEstoque = produtos.reduce((a, p) => a + p.estoque * p.custo, 0)
  const alertas = produtos.filter((p) => p.status !== 'ok').length

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: C.accent, fontFamily: 'monospace', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>
          Visão Geral
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, letterSpacing: -0.5 }}>Dashboard</h2>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <KPI label="Receita Mar"   value={fmtBRL(53000)}       sub="↑ 15% vs fev"    color={C.accent}  icon={TrendingUp}   />
        <KPI label="Despesas Mar"  value={fmtBRL(31000)}       sub="↓ 3% vs fev"     color={C.blue}    icon={TrendingDown} />
        <KPI label="Val. Estoque"  value={fmtBRL(totalEstoque)} sub="10 produtos"    color={C.yellow}  icon={Boxes}        />
        <KPI label="Alertas"       value={alertas}              sub={`${alertas} itens críticos`} color={C.red} icon={AlertTriangle} />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Fluxo de Caixa — Últimos 7 meses</span>
            <button onClick={() => setPage('financeiro')} style={{ fontSize: 11, color: C.blue, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              Ver detalhes <ChevronRight size={12} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={cashflowData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.accent} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={C.accent} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.blue} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={C.blue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="mes" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="receitas" name="Receitas" stroke={C.accent} fill="url(#gr)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="despesas" name="Despesas" stroke={C.blue}   fill="url(#gb)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Alertas de Estoque</span>
            <button onClick={() => setPage('estoque')} style={{ fontSize: 11, color: C.blue, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              Ver todos <ChevronRight size={12} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {produtos.filter((p) => p.status !== 'ok').map((p) => {
              const cfg = STATUS_ESTOQUE[p.status]
              return (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: C.s2, borderRadius: 8, border: `1px solid ${C.border}` }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{p.nome}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{p.sku}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: cfg.color }}>{p.estoque}</div>
                    <Tag color={cfg.color} bg={cfg.bg}>{cfg.label}</Tag>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card style={{ padding: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 14 }}>Últimas Movimentações</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {movimentos.slice(0, 5).map((m) => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: m.tipo === 'entrada' ? 'rgba(0,217,168,.12)' : m.tipo === 'saida' ? 'rgba(255,91,107,.12)' : 'rgba(247,201,72,.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {m.tipo === 'entrada' ? <ArrowDown size={13} color={C.accent} />
                    : m.tipo === 'saida' ? <ArrowUp size={13} color={C.red} />
                    : <RefreshCw size={13} color={C.yellow} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.produto}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{m.origem}</div>
                </div>
                <div style={{ fontSize: 11, color: C.muted, flexShrink: 0 }}>{m.data}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 14 }}>Contas a Vencer</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {contasPagar.filter((c) => c.status !== 'pago').slice(0, 5).map((c) => {
              const cfg = STATUS_FIN[c.status]
              return (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{c.descricao}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{c.vencimento} · {c.categoria}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: cfg.color }}>{fmtBRL(c.valor)}</div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
