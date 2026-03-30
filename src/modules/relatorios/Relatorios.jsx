import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import {
  Container, HeaderWrap, HeaderLeft, ModuleBadge, Title,
  HeaderActions, TabsWrap, TabBtn, RefreshBtn,
} from './RelatoriosStyles'
import { PeriodFilter, defaultPeriod } from './components/PeriodFilter'
import { ExportButton } from './components/ExportButton'
import { VisaoGeral }    from './tabs/VisaoGeral'
import { RelVendas }     from './tabs/RelVendas'
import { RelEstoque }    from './tabs/RelEstoque'
import { RelClientes }   from './tabs/RelClientes'
import { RelFinanceiro } from './tabs/RelFinanceiro'
import { RelFiscal }     from './tabs/RelFiscal'

const TABS = [
  { key: 'visao-geral',  label: 'Visão Geral'  },
  { key: 'vendas',       label: 'Vendas'        },
  { key: 'estoque',      label: 'Estoque'       },
  { key: 'clientes',     label: 'Clientes'      },
  { key: 'financeiro',   label: 'Financeiro'    },
  { key: 'fiscal',       label: 'Fiscal'        },
]

export function Relatorios() {
  const [tab,      setTab]      = useState('visao-geral')
  const [period,   setPeriod]   = useState(defaultPeriod)
  const [spinning, setSpinning] = useState(false)

  // Força re-render das abas para acionar refetch nos hooks filhos
  const [refreshKey, setRefreshKey] = useState(0)

  async function handleRefresh() {
    setSpinning(true)
    setRefreshKey(k => k + 1)
    // Aguarda o ciclo de render antes de parar o spinner
    await new Promise(r => setTimeout(r, 600))
    setSpinning(false)
  }

  function renderTab() {
    const props = { period, key: refreshKey }
    switch (tab) {
      case 'visao-geral':  return <VisaoGeral    {...props} />
      case 'vendas':       return <RelVendas     {...props} />
      case 'estoque':      return <RelEstoque    {...props} />
      case 'clientes':     return <RelClientes   {...props} />
      case 'financeiro':   return <RelFinanceiro {...props} />
      case 'fiscal':       return <RelFiscal     {...props} />
      default:             return null
    }
  }

  return (
    <Container>
      {/* Header */}
      <HeaderWrap data-print-hide>
        <HeaderLeft>
          <ModuleBadge>Análise</ModuleBadge>
          <Title>Central de Relatórios</Title>
        </HeaderLeft>
        <HeaderActions>
          <ExportButton tab={tab} />
          <RefreshBtn
            onClick={handleRefresh}
            disabled={spinning}
            $spinning={spinning}
            title="Atualizar dados"
            data-print-hide
          >
            <RefreshCw size={14} />
          </RefreshBtn>
        </HeaderActions>
      </HeaderWrap>

      {/* Filtro de período global */}
      <PeriodFilter period={period} onChange={setPeriod} />

      {/* Tabs de navegação */}
      <TabsWrap data-print-hide>
        {TABS.map(({ key, label }) => (
          <TabBtn
            key={key}
            $active={tab === key}
            onClick={() => setTab(key)}
          >
            {label}
          </TabBtn>
        ))}
      </TabsWrap>

      {/* Conteúdo da aba ativa */}
      {renderTab()}
    </Container>
  )
}
