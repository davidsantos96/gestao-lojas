import { useState, useEffect } from 'react'
import { Bell, Settings, ChevronRight, Menu, X } from 'lucide-react'
import { C } from '../../constants/theme'

const PAGE_LABELS = {
  dashboard:  'Dashboard',
  estoque:    'Estoque',
  financeiro: 'Financeiro',
  vendas:     'Vendas',
  clientes:   'Clientes',
  fiscal:     'Fiscal',
  relatorios: 'Relatórios',
}

function useDateTime() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

export function Header({ page, onToggleSidebar, sidebarOpen }) {
  const now = useDateTime()

  const dateStr = now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return (
    <header style={{
      padding: '12px 20px',
      borderBottom: `1px solid ${C.border}`,
      background: C.surface,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 10,
      gap: 12,
    }}>
      {/* Esquerda: botão menu + breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <button
          id="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          title={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 6, borderRadius: 6, display: 'flex', alignItems: 'center',
            color: C.muted, flexShrink: 0,
            transition: 'color .15s, background .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = C.text; e.currentTarget.style.background = C.s3 }}
          onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.background = 'none' }}
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.muted, overflow: 'hidden' }}>
          <span style={{ whiteSpace: 'nowrap' }}>Sistema</span>
          <ChevronRight size={12} style={{ flexShrink: 0 }} />
          <span style={{ color: C.text, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {PAGE_LABELS[page]}
          </span>
        </div>
      </div>

      {/* Direita: data/hora + ícones */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
        <div style={{
          fontSize: 11, color: C.muted, fontFamily: 'monospace',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span>{dateStr}</span>
          <span style={{
            background: C.s3, padding: '2px 6px', borderRadius: 4,
            color: C.accent, letterSpacing: 1,
          }}>
            {timeStr}
          </span>
        </div>

        <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <Bell size={16} color={C.muted} />
          <span style={{
            position: 'absolute', top: 2, right: 2,
            width: 6, height: 6, borderRadius: 3, background: C.red,
          }} />
        </button>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <Settings size={16} color={C.muted} />
        </button>
      </div>
    </header>
  )
}
