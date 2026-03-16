import { useState, useMemo } from 'react'
import { Plus, Search, Package, Boxes, DollarSign, AlertTriangle } from 'lucide-react'
import { C } from '../../constants/theme'
import { produtos as allProdutos, movimentos, STATUS_ESTOQUE } from '../../data/mock'
import { fmtBRL } from '../../utils/format'
import { KPI } from '../../components/ui/KPI'
import { TabelaProdutos } from './TabelaProdutos'
import { TabelaMovimentos } from './TabelaMovimentos'
import { ModalMovimentacao } from './ModalMovimentacao'

const TABS = [
  { key: 'produtos',    label: 'Produtos'        },
  { key: 'movimentos',  label: 'Movimentações'   },
]

const FILTROS = [
  { value: 'todos', label: 'Todos'  },
  { value: 'ok',    label: 'Normal' },
  { value: 'low',   label: 'Baixo'  },
  { value: 'out',   label: 'Zerado' },
]

export function Estoque() {
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [tab, setTab] = useState('produtos')
  const [showModal, setShowModal] = useState(false)

  const produtosFiltrados = useMemo(() => allProdutos.filter((p) => {
    const q = busca.toLowerCase()
    const matchBusca = p.nome.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q)
    const matchStatus = filtroStatus === 'todos' || p.status === filtroStatus
    return matchBusca && matchStatus
  }), [busca, filtroStatus])

  const totalUnidades = allProdutos.reduce((a, p) => a + p.estoque, 0)
  const valorTotal = allProdutos.reduce((a, p) => a + p.estoque * p.custo, 0)
  const alertasN = allProdutos.filter((p) => p.status !== 'ok').length

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: C.accent, fontFamily: 'monospace', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>Módulo</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, letterSpacing: -0.5 }}>Gestão de Estoque</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 8, background: C.accent, border: 'none', color: '#0b1a14', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
        >
          <Plus size={15} /> Nova Movimentação
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <KPI label="Total SKUs"   value={allProdutos.length}  sub="produtos ativos"   color={C.blue}   icon={Package}       />
        <KPI label="Unidades"     value={totalUnidades}        sub="em estoque"        color={C.accent} icon={Boxes}         />
        <KPI label="Valor Estoque" value={fmtBRL(valorTotal)} sub="custo médio"       color={C.yellow} icon={DollarSign}    />
        <KPI label="Alertas"      value={alertasN}             sub="precisam atenção"  color={C.red}    icon={AlertTriangle} />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: `1px solid ${C.border}` }}>
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
            color: tab === key ? C.accent : C.muted,
            borderBottom: tab === key ? `2px solid ${C.accent}` : '2px solid transparent',
            marginBottom: -1,
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'produtos' && (
        <>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={14} color={C.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
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
          <TabelaProdutos produtos={produtosFiltrados} />
        </>
      )}

      {tab === 'movimentos' && <TabelaMovimentos movimentos={movimentos} />}

      {showModal && <ModalMovimentacao onClose={() => setShowModal(false)} />}
    </div>
  )
}
