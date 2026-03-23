import { useState, useContext } from 'react'
import { Plus, ArrowUpRight, ArrowDownRight, DollarSign, AlertTriangle, RefreshCw } from 'lucide-react'
import { ThemeContext } from '../../contexts/ThemeContext'
import { fmtBRL } from '../../utils/format'
import { useCashflow, useContasPagar, useContasReceber, useDRE, useLancamentos, useResumoFinanceiro } from '../../hooks/useFinanceiro'
import { KPI } from '../../components/ui/KPI'
import { SkeletonKPI } from '../../components/ui/Skeleton'
import { Cashflow } from './Cashflow'
import { ContasPagar } from './ContasPagar'
import { ContasReceber } from './ContasReceber'
import { DRE } from './DRE'
import { Lancamentos } from './Lancamentos'
import { ModalLancamento } from './ModalLancamento'
import {
  Container, HeaderWrap, HeaderLeft, ModuleBadge, Title,
  HeaderActions, RefreshBtn, CtaBtn, KpiGrid,
  TabsWrap, TabBtn
} from './FinanceiroStyles'

const TABS = [
  { key: 'cashflow', label: 'Fluxo de Caixa'  },
  { key: 'pagar',    label: 'Contas a Pagar'   },
  { key: 'receber',  label: 'Contas a Receber' },
  { key: 'dre',      label: 'DRE'              },
]

export function Financeiro() {
  const [tab,       setTab]       = useState('cashflow')
  const [showModal,    setShowModal]    = useState(false)
  const [refreshing,   setRefreshing]   = useState(false)
  const [lancamentoEdit, setLancamentoEdit] = useState(null)

  const { theme } = useContext(ThemeContext)

  // ── Hooks de dados ───────────────────────────────────────────────────────
  const cashflow    = useCashflow()
  const pagar       = useContasPagar()
  const receber     = useContasReceber()
  const dre         = useDRE()
  const lancamentoHook     = useLancamentos()
  const lancamentosDespesa = useLancamentos({ tipo: 'DESPESA' })
  const lancamentosReceita = useLancamentos({ tipo: 'RECEITA' })
  const { data: resumoFin, execute: refetchResumo } = useResumoFinanceiro()

  const loadingKPIs = cashflow.loading || pagar.loading

  // KPIs vindos da API
  const receita  = resumoFin?.receita  ?? 0
  const despesas = resumoFin?.despesas ?? 0
  const saldo    = resumoFin?.saldo    ?? 0

  const handleRefetchAll = async () => {
    setRefreshing(true)
    await Promise.all([cashflow.execute(), pagar.refetch(), receber.refetch(), dre.execute(), lancamentosDespesa.refetch(), lancamentosReceita.refetch(), refetchResumo()])
    setRefreshing(false)
  }

  const handleNovoLancamento = async (data) => {
    if (lancamentoEdit) {
      await lancamentoHook.editar(lancamentoEdit.id, data)
    } else {
      await lancamentoHook.criar(data)
    }
    setLancamentoEdit(null)
    handleRefetchAll()
  }

  return (
    <Container>
      {/* Header */}
      <HeaderWrap>
        <HeaderLeft>
          <ModuleBadge>Módulo</ModuleBadge>
          <Title>Gestão Financeira</Title>
        </HeaderLeft>
        <HeaderActions>
          <RefreshBtn
            onClick={handleRefetchAll}
            disabled={refreshing}
            $refreshing={refreshing}
            title="Atualizar dados"
          >
            <RefreshCw size={14} />
            {refreshing ? 'Atualizando...' : ''}
          </RefreshBtn>
          <CtaBtn onClick={() => setShowModal(true)}>
            <Plus size={15} /> Novo Lançamento
          </CtaBtn>
        </HeaderActions>
      </HeaderWrap>

      {/* KPIs */}
      <KpiGrid>
        {loadingKPIs
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonKPI key={i} />)
          : <>
              <KPI label="Receita Mar"  value={fmtBRL(receita)}        sub="↑ 15% vs fev"    color={theme.colors.accent} icon={ArrowUpRight}   />
              <KPI label="Despesas Mar" value={fmtBRL(despesas)}       sub="↓ 3% vs fev"     color={theme.colors.blue}   icon={ArrowDownRight} />
              <KPI label="Saldo do Mês" value={fmtBRL(saldo)}          sub="lucro líquido"   color={theme.colors.yellow} icon={DollarSign}     />
              <KPI label="Vence em 7d"  value={fmtBRL(pagar.totalPendente)} sub="contas a pagar" color={theme.colors.red} icon={AlertTriangle}  />
            </>
        }
      </KpiGrid>

      {/* Tabs */}
      <TabsWrap>
        {TABS.map(({ key, label }) => (
          <TabBtn 
            key={key} 
            onClick={() => setTab(key)} 
            $active={tab === key}
          >
            {label}
          </TabBtn>
        ))}
      </TabsWrap>

      {/* Content */}
      {tab === 'cashflow' && (
        <Cashflow data={cashflow.data} loading={cashflow.loading} error={cashflow.error} onRefetch={cashflow.execute} />
      )}
      {tab === 'pagar' && (
        <>
          <ContasPagar
            contas={pagar.contas} totalPendente={pagar.totalPendente}
            loading={pagar.loading} error={pagar.error}
            onRefetch={pagar.refetch} onPagar={pagar.pagar}
          />
          <Lancamentos
            titulo="Lançamentos de Despesa"
            lancamentos={lancamentosDespesa.lancamentos}
            total={lancamentosDespesa.total}
            loading={lancamentosDespesa.loading}
            error={lancamentosDespesa.error}
            onRefetch={lancamentosDespesa.refetch}
            onEditar={l => { setLancamentoEdit(l); setShowModal(true) }}
            onRemover={id => lancamentoHook.remover(id).then(handleRefetchAll)}
          />
        </>
      )}
      {tab === 'receber' && (
        <>
          <ContasReceber
            contas={receber.contas} totalPendente={receber.totalPendente}
            loading={receber.loading} error={receber.error}
            onRefetch={receber.refetch} onReceber={receber.receber}
          />
          <Lancamentos
            titulo="Lançamentos de Receita"
            lancamentos={lancamentosReceita.lancamentos}
            total={lancamentosReceita.total}
            loading={lancamentosReceita.loading}
            error={lancamentosReceita.error}
            onRefetch={lancamentosReceita.refetch}
            onEditar={l => { setLancamentoEdit(l); setShowModal(true) }}
            onRemover={id => lancamentoHook.remover(id).then(handleRefetchAll)}
          />
        </>
      )}
      {tab === 'dre' && (
        <DRE data={dre.data} loading={dre.loading} error={dre.error} onRefetch={dre.execute} />
      )}
      {showModal && (
        <ModalLancamento
          lancamento={lancamentoEdit}
          onClose={() => { setShowModal(false); setLancamentoEdit(null) }}
          onSubmit={handleNovoLancamento}
        />
      )}
    </Container>
  )
}

