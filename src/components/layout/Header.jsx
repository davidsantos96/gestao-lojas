import { Bell, Settings, ChevronRight } from 'lucide-react'
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

export function Header({ page }) {
  return (
    <header style={{
      padding: '16px 32px',
      borderBottom: `1px solid ${C.border}`,
      background: C.surface,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.muted }}>
        <span>Sistema</span>
        <ChevronRight size={12} />
        <span style={{ color: C.text, fontWeight: 600 }}>{PAGE_LABELS[page]}</span>
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ fontSize: 11, color: C.muted, fontFamily: 'monospace' }}>15/03/2026</div>
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
