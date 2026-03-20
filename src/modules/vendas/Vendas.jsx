import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { C } from '../../constants/theme'
import { NovaVenda } from './NovaVenda'
import { HistoricoVendas } from './HistoricoVendas'
import { RelatorioVendas } from './RelatorioVendas'
import { useProdutos } from '../../hooks/useProdutos'

const TABS = [
  { key: 'nova',      label: 'Nova Venda'  },
  { key: 'historico', label: 'Histórico'   },
  { key: 'relatorio', label: 'Relatório'   },
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
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: C.accent, fontFamily: 'monospace', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>Módulo</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, letterSpacing: -0.5 }}>Vendas</h2>
        </div>
        <button onClick={handleRefetch} disabled={refreshing} title="Atualizar"
          style={{ padding: '9px 12px', borderRadius: 8, background: C.s2, border: `1px solid ${C.border}`, color: C.muted, cursor: refreshing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          <RefreshCw size={14} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
        </button>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: C.s2, borderRadius: 10, padding: 4, border: `1px solid ${C.border}`, width: 'fit-content' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '7px 18px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all .15s',
            background: tab === t.key ? C.surface : 'transparent',
            color:      tab === t.key ? C.text    : C.muted,
            boxShadow:  tab === t.key ? '0 1px 4px rgba(0,0,0,.3)' : 'none',
          }}>{t.label}</button>
        ))}
      </div>

      {tab === 'nova'      && <NovaVenda produtos={produtos} onVendaConcluida={() => setTab('historico')} />}
      {tab === 'historico' && <HistoricoVendas />}
      {tab === 'relatorio' && <RelatorioVendas />}

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )
}
