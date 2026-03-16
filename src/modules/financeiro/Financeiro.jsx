import { useState } from 'react'
import { Plus, ArrowUpRight, ArrowDownRight, DollarSign, AlertTriangle } from 'lucide-react'
import { C } from '../../constants/theme'
import { contasPagar } from '../../data/mock'
import { fmtBRL } from '../../utils/format'
import { KPI } from '../../components/ui/KPI'
import { Cashflow } from './Cashflow'
import { ContasPagar } from './ContasPagar'
import { ContasReceber } from './ContasReceber'
import { DRE } from './DRE'

const TABS = [
  { key: 'cashflow', label: 'Fluxo de Caixa'     },
  { key: 'pagar',    label: 'Contas a Pagar'      },
  { key: 'receber',  label: 'Contas a Receber'    },
  { key: 'dre',      label: 'DRE'                 },
]

export function Financeiro() {
  const [tab, setTab] = useState('cashflow')

  const totalPagar = contasPagar
    .filter((c) => c.status !== 'pago')
    .reduce((a, c) => a + c.valor, 0)

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: C.blue, fontFamily: 'monospace', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>Módulo</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, letterSpacing: -0.5 }}>Gestão Financeira</h2>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px',
          borderRadius: 8, background: C.blue, border: 'none',
          color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
        }}>
          <Plus size={15} /> Novo Lançamento
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <KPI label="Receita Mar"   value={fmtBRL(53000)}    sub="↑ 15% vs fev"    color={C.accent} icon={ArrowUpRight}   />
        <KPI label="Despesas Mar"  value={fmtBRL(31000)}    sub="↓ 3% vs fev"     color={C.blue}   icon={ArrowDownRight} />
        <KPI label="Saldo do Mês"  value={fmtBRL(22000)}    sub="lucro líquido"   color={C.yellow} icon={DollarSign}     />
        <KPI label="Vence em 7d"   value={fmtBRL(totalPagar)} sub="contas a pagar" color={C.red}   icon={AlertTriangle}  />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: `1px solid ${C.border}` }}>
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: '10px 18px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
            color: tab === key ? C.blue : C.muted,
            borderBottom: tab === key ? `2px solid ${C.blue}` : '2px solid transparent',
            marginBottom: -1,
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'cashflow' && <Cashflow />}
      {tab === 'pagar'    && <ContasPagar />}
      {tab === 'receber'  && <ContasReceber />}
      {tab === 'dre'      && <DRE />}
    </div>
  )
}
