import { useState } from 'react'
import { Plus, Search, Package, Boxes, DollarSign, AlertTriangle, RefreshCw } from 'lucide-react'
import { C } from '../../constants/theme'
import { fmtBRL } from '../../utils/format'
import { useProdutos } from '../../hooks/useProdutos'
import { useMovimentos } from '../../hooks/useMovimentos'
import { KPI } from '../../components/ui/KPI'
import { SkeletonKPI } from '../../components/ui/Skeleton'
import { TabelaProdutos } from './TabelaProdutos'
import { TabelaMovimentos } from './TabelaMovimentos'
import { ModalProduto } from './ModalProduto'
import { ModalMovimentacao } from './ModalMovimentacao'

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

// Botão primário contextual por aba
const CTA = {
  produtos:   { label: 'Novo Produto',       color: C.accent,  textColor: '#0b1a14' },
  movimentos: { label: 'Nova Movimentação',  color: C.blue,    textColor: '#fff'    },
}

export function Estoque() {
  const [tab,           setTab]           = useState('produtos')
  const [modalProduto,  setModalProduto]  = useState(false)   // false | null (novo) | objeto (editar)
  const [modalMov,      setModalMov]      = useState(false)

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
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: C.accent, fontFamily: 'monospace', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>Módulo</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, letterSpacing: -0.5 }}>Gestão de Estoque</h2>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => { refetchProd(); refetchMov() }}
            title="Atualizar dados"
            style={{ padding: '9px 12px', borderRadius: 8, background: C.s2, border: `1px solid ${C.border}`, color: C.muted2, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <RefreshCw size={15} />
          </button>
          <button
            onClick={handleCTA}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 18px', borderRadius: 8, border: 'none',
              background: cta.color, color: cta.textColor,
              fontWeight: 700, fontSize: 13, cursor: 'pointer',
              transition: 'background .15s',
            }}
          >
            <Plus size={15} /> {cta.label}
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {loadProd
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonKPI key={i} />)
          : <>
              <KPI label="Total SKUs"    value={resumo.totalSkus}          sub="produtos ativos"  color={C.blue}   icon={Package}       />
              <KPI label="Unidades"      value={resumo.totalUnidades}       sub="em estoque"       color={C.accent} icon={Boxes}         />
              <KPI label="Valor Estoque" value={fmtBRL(resumo.valorTotal)} sub="pelo custo"       color={C.yellow} icon={DollarSign}    />
              <KPI label="Alertas"       value={resumo.alertas}             sub="precisam atenção" color={C.red}    icon={AlertTriangle} />
            </>
        }
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: `1px solid ${C.border}` }}>
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 600,
            color: tab === key ? C.accent : C.muted,
            borderBottom: tab === key ? `2px solid ${C.accent}` : '2px solid transparent',
            marginBottom: -1,
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* Aba Produtos */}
      {tab === 'produtos' && (
        <>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={14} color={C.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                value={busca}
                onChange={e => setBusca(e.target.value)}
                placeholder="Buscar por nome, SKU ou categoria..."
                style={{ width: '100%', padding: '9px 12px 9px 34px', background: C.s2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {FILTROS.map(({ value, label }) => (
                <button key={value} onClick={() => setFiltroStatus(value)} style={{
                  padding: '9px 14px', borderRadius: 8,
                  border: `1px solid ${filtroStatus === value ? C.accent : C.border}`,
                  background: filtroStatus === value ? 'rgba(0,217,168,.1)' : C.s2,
                  color: filtroStatus === value ? C.accent : C.muted,
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

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
          onClose={() => setModalMov(false)}
          onSubmit={handleNovaMovimentacao}
        />
      )}
    </div>
  )
}
