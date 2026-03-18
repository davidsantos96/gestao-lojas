import { useState } from 'react'
import { Plus, ArrowUpRight, ArrowDownRight, DollarSign, AlertTriangle, RefreshCw } from 'lucide-react'
import { C } from '../../constants/theme'
import { fmtBRL } from '../../utils/format'
import { useCashflow, useContasPagar, useContasReceber, useDRE, useLancamento, useLancamentos, useResumoFinanceiro } from '../../hooks/useFinanceiro'
import { KPI } from '../../components/ui/KPI'
import { SkeletonKPI } from '../../components/ui/Skeleton'
import { Cashflow } from './Cashflow'
import { ContasPagar } from './ContasPagar'
import { ContasReceber } from './ContasReceber'
import { DRE } from './DRE'
import { Lancamentos } from './Lancamentos'
import { ModalLancamento } from './ModalLancamento'

const TABS = [
  { key: 'cashflow',    label: 'Fluxo de Caixa'  },
  { key: 'pagar',       label: 'Contas a Pagar'   },
  { key: 'receber',     label: 'Contas a Receber' },
  { key: 'lancamentos', label: 'Lançamentos'      },
  { key: 'dre',         label: 'DRE'              },
]

export function Financeiro() {
  const [tab,       setTab]       = useState('cashflow')
  const [showModal,  setShowModal]  = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // ── Hooks de dados ───────────────────────────────────────────────────────
  const cashflow    = useCashflow()
  const pagar       = useContasPagar()
  const receber     = useContasReceber()
  const dre         = useDRE()
  const lancamento  = useLancamento()
  const lancamentos = useLancamentos()
  const { data: resumoFin, execute: refetchResumo } = useResumoFinanceiro()

  const loadingKPIs = cashflow.loading || pagar.loading

  // KPIs vindos da API
  const receita  = resumoFin?.receita  ?? 0
  const despesas = resumoFin?.despesas ?? 0
  const saldo    = resumoFin?.saldo    ?? 0

  const handleRefetchAll = async () => {
    setRefreshing(true)
    await Promise.all([cashflow.execute(), pagar.refetch(), receber.refetch(), dre.execute(), lancamentos.refetch(), refetchResumo()])
    setRefreshing(false)
  }

  const handleNovoLancamento = async (data) => {
    await lancamento.criar(data)
    handleRefetchAll()
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: C.blue, fontFamily: 'monospace', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>Módulo</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, letterSpacing: -0.5 }}>Gestão Financeira</h2>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleRefetchAll}
            disabled={refreshing}
            title="Atualizar dados"
            style={{ padding: '9px 12px', borderRadius: 8, background: C.s2, border: `1px solid ${C.border}`, color: refreshing ? C.muted : C.muted2, cursor: refreshing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}
          >
            <RefreshCw size={14} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
            {refreshing ? 'Atualizando...' : ''}
          </button>
          <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
          <button
            onClick={() => setShowModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 8, background: C.blue, border: 'none', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
          >
            <Plus size={15} /> Novo Lançamento
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {loadingKPIs
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonKPI key={i} />)
          : <>
              <KPI label="Receita Mar"  value={fmtBRL(receita)}        sub="↑ 15% vs fev"    color={C.accent} icon={ArrowUpRight}   />
              <KPI label="Despesas Mar" value={fmtBRL(despesas)}       sub="↓ 3% vs fev"     color={C.blue}   icon={ArrowDownRight} />
              <KPI label="Saldo do Mês" value={fmtBRL(saldo)}          sub="lucro líquido"   color={C.yellow} icon={DollarSign}     />
              <KPI label="Vence em 7d"  value={fmtBRL(pagar.totalPendente)} sub="contas a pagar" color={C.red} icon={AlertTriangle}  />
            </>
        }
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
      {tab === 'cashflow' && (
        <Cashflow data={cashflow.data} loading={cashflow.loading} error={cashflow.error} onRefetch={cashflow.execute} />
      )}
      {tab === 'pagar' && (
        <ContasPagar
          contas={pagar.contas} totalPendente={pagar.totalPendente}
          loading={pagar.loading} error={pagar.error}
          onRefetch={pagar.refetch} onPagar={pagar.pagar}
        />
      )}
      {tab === 'receber' && (
        <ContasReceber
          contas={receber.contas} totalPendente={receber.totalPendente}
          loading={receber.loading} error={receber.error}
          onRefetch={receber.refetch} onReceber={receber.receber}
        />
      )}
      {tab === 'dre' && (
        <DRE data={dre.data} loading={dre.loading} error={dre.error} onRefetch={dre.execute} />
      )}
      {tab === 'lancamentos' && (
        <Lancamentos
          lancamentos={lancamentos.lancamentos}
          total={lancamentos.total}
          loading={lancamentos.loading}
          error={lancamentos.error}
          onRefetch={lancamentos.refetch}
        />
      )}

      {showModal && (
        <ModalLancamento
          onClose={() => setShowModal(false)}
          onSubmit={handleNovoLancamento}
        />
      )}
    </div>
  )
}
