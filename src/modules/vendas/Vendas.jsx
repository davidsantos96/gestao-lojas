import { useState } from 'react'
import { RefreshCw, ShoppingCart, Clock, BarChart2 } from 'lucide-react'
import { C } from '../../constants/theme'
import { NovaVenda } from './NovaVenda'
import { HistoricoVendas } from './HistoricoVendas'
import { RelatorioVendas } from './RelatorioVendas'
import { useProdutos } from '../../hooks/useProdutos'

const TABS = [
  { key: 'nova',      label: 'Nova Venda',  icon: ShoppingCart },
  { key: 'historico', label: 'Histórico',   icon: Clock        },
  { key: 'relatorio', label: 'Relatório',   icon: BarChart2    },
]

export function Vendas() {
  const [tab,        setTab]        = useState('nova')
  const [refreshing, setRefreshing] = useState(false)
  const { produtos, refetch: refetchProdutos } = useProdutos()

  const handleRefetch = async () => {
    setRefreshing(true)
    await refetchProdutos()
    setRefreshing(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 10, color: C.accent, fontFamily: 'monospace',
            letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8,
            background: `${C.accent}14`, border: `1px solid ${C.accent}28`,
            padding: '4px 10px', borderRadius: 20,
          }}>
            <ShoppingCart size={10} />
            Módulo
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: C.text, letterSpacing: -0.8, lineHeight: 1, margin: 0 }}>
            Vendas
          </h2>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 6, marginBottom: 0 }}>
            Registre e acompanhe suas transações
          </p>
        </div>

        <button
          onClick={handleRefetch}
          disabled={refreshing}
          title="Atualizar dados"
          style={{
            padding: '9px 14px', borderRadius: 10,
            background: C.s2, border: `1px solid ${C.border}`,
            color: C.muted, cursor: refreshing ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 7, fontSize: 12,
            transition: 'all .15s',
          }}
        >
          <RefreshCw size={14} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
          Atualizar
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 2, marginBottom: 28,
        background: C.s2, borderRadius: 12, padding: 4,
        border: `1px solid ${C.border}`, width: 'fit-content',
      }}>
        {TABS.map(t => {
          const Icon = t.icon
          const active = tab === t.key
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '8px 20px', borderRadius: 9, border: 'none',
                cursor: 'pointer', fontSize: 13, fontWeight: 600,
                transition: 'all .15s',
                background: active ? C.surface : 'transparent',
                color:      active ? C.text    : C.muted,
                boxShadow:  active ? '0 1px 6px rgba(0,0,0,.35)' : 'none',
              }}
            >
              <Icon size={14} color={active ? C.accent : 'inherit'} />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div>
        {tab === 'nova'      && <NovaVenda produtos={produtos} onVendaConcluida={() => setTab('historico')} />}
        {tab === 'historico' && <HistoricoVendas />}
        {tab === 'relatorio' && <RelatorioVendas />}
      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  )
}
