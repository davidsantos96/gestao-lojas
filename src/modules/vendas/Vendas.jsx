import { useState } from 'react'
import { RefreshCw, ShoppingCart, Clock, BarChart2 } from 'lucide-react'
import { NovaVenda } from './NovaVenda'
import { HistoricoVendas } from './HistoricoVendas'
import { RelatorioVendas } from './RelatorioVendas'
import { useProdutos } from '../../hooks/useProdutos'
import { 
  Container, HeaderArea, HeaderLeft, ModuleBadge, 
  Title, Subtitle, RefreshButton, TabsContainer, 
  TabButton, ContentArea 
} from './VendasStyles'

const TABS = [
  { key: 'nova',      label: 'Nova Venda',  icon: ShoppingCart },
  { key: 'historico', label: 'Histórico',   icon: Clock        },
  { key: 'relatorio', label: 'Relatório',   icon: BarChart2    },
]

export function Vendas() {
  const [tab, setTab] = useState('nova')
  const [refreshing, setRefreshing] = useState(false)
  const { produtos, refetch: refetchProdutos } = useProdutos()

  const handleRefetch = async () => {
    setRefreshing(true)
    await refetchProdutos()
    setRefreshing(false)
  }

  return (
    <Container>

      {/* Header */}
      <HeaderArea>
        <HeaderLeft>
          <ModuleBadge>
            <ShoppingCart size={10} />
            Módulo
          </ModuleBadge>
          <Title>Vendas</Title>
          <Subtitle>Registre e acompanhe suas transações</Subtitle>
        </HeaderLeft>

        <RefreshButton
          onClick={handleRefetch}
          disabled={refreshing}
          $refreshing={refreshing}
          title="Atualizar dados"
        >
          <RefreshCw size={14} className="icon" />
          Atualizar
        </RefreshButton>
      </HeaderArea>

      {/* Tabs */}
      <TabsContainer>
        {TABS.map(t => {
          const Icon = t.icon
          const active = tab === t.key
          return (
            <TabButton
              key={t.key}
              onClick={() => setTab(t.key)}
              $active={active}
            >
              <span className="icon-color">
                <Icon size={14} />
              </span>
              {t.label}
            </TabButton>
          )
        })}
      </TabsContainer>

      {/* Content */}
      <ContentArea>
        {tab === 'nova'      && <NovaVenda produtos={produtos} onVendaConcluida={() => setTab('historico')} />}
        {tab === 'historico' && <HistoricoVendas />}
        {tab === 'relatorio' && <RelatorioVendas />}
      </ContentArea>

    </Container>
  )
}
