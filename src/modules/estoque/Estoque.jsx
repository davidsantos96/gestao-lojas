import { useState, useContext } from 'react'
import { Plus, Search, Package, Boxes, DollarSign, AlertTriangle, RefreshCw } from 'lucide-react'
import { fmtBRL } from '../../utils/format'
import { useProdutos } from '../../hooks/useProdutos'
import { useMovimentos } from '../../hooks/useMovimentos'
import { KPI } from '../../components/ui/KPI'
import { SkeletonKPI } from '../../components/ui/Skeleton'
import { TabelaProdutos } from './TabelaProdutos'
import { TabelaMovimentos } from './TabelaMovimentos'
import { ModalProduto } from './ModalProduto'
import { ModalMovimentacao } from './ModalMovimentacao'
import { ThemeContext } from '../../contexts/ThemeContext'
import {
  Container, HeaderWrap, HeaderLeft, ModuleBadge, Title,
  HeaderActions, RefreshBtn, CtaBtn, KpiGrid, TabsWrap,
  TabBtn, FiltersWrap, SearchBox, SearchInput, StatusFiltersWrap,
  FilterBtn
} from './EstoqueStyles'

const TABS = [
  { key: 'produtos',   label: 'Produtos'      },
  { key: 'movimentos', label: 'Movimentações' },
]

const FILTROS = [
  { value: 'todos', label: 'Todos'  },
  { value: 'ok',    label: 'Normal' },
  { value: 'low',   label: 'Baixo'  },
  { value: 'out',   label: 'Zerado' },
]

export function Estoque() {
  const [tab,           setTab]           = useState('produtos')
  const [modalProduto,  setModalProduto]  = useState(false)   // false | null (novo) | objeto (editar)
  const [modalMov,      setModalMov]      = useState(false)
  const [refreshing,    setRefreshing]    = useState(false)

  const { theme } = useContext(ThemeContext)

  // Botão primário contextual por aba
  const CTA = {
    produtos:   { label: 'Novo Produto',       color: theme.colors.accent,  textColor: '#0b1a14' },
    movimentos: { label: 'Nova Movimentação',  color: theme.colors.blue,    textColor: '#fff'    },
  }

  // ── Hooks de dados ───────────────────────────────────────────────────────
  const {
    produtosFiltrados, resumo, loading: loadProd, error: errProd,
    busca, setBusca, filtroStatus, setFiltroStatus,
    refetch: refetchProd, adicionarProduto, editarProduto, removerProduto,
  } = useProdutos()

  const {
    movimentos, loading: loadMov, error: errMov,
    refetch: refetchMov, registrarMovimento,
  } = useMovimentos()

  // ── Refresh ──────────────────────────────────────────────────────────────
  const handleRefresh = async () => {
    setRefreshing(true)
    await Promise.all([refetchProd(), refetchMov()])
    setRefreshing(false)
  }

  // ── CTA contextual ───────────────────────────────────────────────────────
  const handleCTA = () => {
    if (tab === 'produtos')   setModalProduto(null)   // null = novo produto
    if (tab === 'movimentos') setModalMov(true)
  }

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleSalvarProduto = async (data) => {
    if (modalProduto) {
      await editarProduto(modalProduto.id, data)
    } else {
      await adicionarProduto(data)
    }
  }

  const handleNovaMovimentacao = async (data) => {
    await registrarMovimento(data)
    await refetchProd()   // atualiza saldo dos produtos
  }

  const cta = CTA[tab]

  return (
    <Container>
      {/* Header */}
      <HeaderWrap>
        <HeaderLeft>
          <ModuleBadge>Módulo</ModuleBadge>
          <Title>Gestão de Estoque</Title>
        </HeaderLeft>
        <HeaderActions>
          <RefreshBtn
            onClick={handleRefresh}
            disabled={refreshing}
            $refreshing={refreshing}
            title="Atualizar dados"
          >
            <RefreshCw size={14} />
            {refreshing ? 'Atualizando...' : ''}
          </RefreshBtn>
          <CtaBtn
            onClick={handleCTA}
            $color={cta.color}
            $textColor={cta.textColor}
          >
            <Plus size={15} /> {cta.label}
          </CtaBtn>
        </HeaderActions>
      </HeaderWrap>

      {/* KPIs */}
      <KpiGrid>
        {loadProd
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonKPI key={i} />)
          : <>
              <KPI label="Total Códigos"    value={produtosFiltrados.length}  sub={`de ${resumo.totalSkus} cadastrados`}  color={theme.colors.blue}   icon={Package}       />
              <KPI label="Unidades"      value={resumo.totalUnidades}       sub="em estoque"       color={theme.colors.accent} icon={Boxes}         />
              <KPI label="Valor Estoque" value={null} sub={`Custo: ${fmtBRL(resumo.valorTotal)}`} sub2={`Venda: ${fmtBRL(resumo.valorTotalVenda)}`} color={theme.colors.yellow} icon={DollarSign} />
              <KPI label="Alertas"       value={resumo.alertas}             sub="precisam atenção" color={theme.colors.red}    icon={AlertTriangle} />
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

      {/* Aba Produtos */}
      {tab === 'produtos' && (
        <>
          <FiltersWrap>
            <SearchBox>
              <Search size={14} className="search-icon" color={theme.colors.muted} />
              <SearchInput
                value={busca}
                onChange={e => setBusca(e.target.value)}
                placeholder="Buscar por nome, código ou categoria..."
              />
            </SearchBox>
            <StatusFiltersWrap>
              {FILTROS.map(({ value, label }) => (
                <FilterBtn 
                  key={value} 
                  onClick={() => setFiltroStatus(value)} 
                  $active={filtroStatus === value}
                >
                  {label}
                </FilterBtn>
              ))}
            </StatusFiltersWrap>
          </FiltersWrap>

          <TabelaProdutos
            produtos={produtosFiltrados}
            loading={loadProd}
            error={errProd}
            onRefetch={refetchProd}
            onEditar={p => setModalProduto(p)}      // abre modal de edição
            onRemover={p => removerProduto(p.id)}
          />
        </>
      )}

      {/* Aba Movimentações */}
      {tab === 'movimentos' && (
        <TabelaMovimentos
          movimentos={movimentos}
          loading={loadMov}
          error={errMov}
          onRefetch={refetchMov}
        />
      )}

      {/* Modal Produto (novo: modalProduto === null | editar: modalProduto = objeto) */}
      {modalProduto !== false && (
        <ModalProduto
          produto={modalProduto}
          onClose={() => setModalProduto(false)}
          onSubmit={handleSalvarProduto}
        />
      )}

      {/* Modal Movimentação */}
      {modalMov && (
        <ModalMovimentacao
          produtos={produtosFiltrados}
          onClose={() => setModalMov(false)}
          onSubmit={handleNovaMovimentacao}
        />
      )}
    </Container>
  )
}
