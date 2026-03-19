import {
  LayoutDashboard, Boxes, Wallet, ShoppingCart,
  Users, FileText, BarChart2, LogOut,
} from 'lucide-react'
import { C } from '../../constants/theme'
import { useAuth } from '../../hooks/useAuth'

const ICON_MAP = { LayoutDashboard, Boxes, Wallet, ShoppingCart, Users, FileText, BarChart2 }

const NAV_ITEMS = [
  { key: 'dashboard',  label: 'Dashboard',  icon: 'LayoutDashboard' },
  { key: 'estoque',    label: 'Estoque',     icon: 'Boxes'           },
  { key: 'financeiro', label: 'Financeiro',  icon: 'Wallet'          },
  { key: 'vendas',     label: 'Vendas',      icon: 'ShoppingCart'    },
  { key: 'clientes',   label: 'Clientes',    icon: 'Users',          locked: true },
  { key: 'fiscal',     label: 'Fiscal',      icon: 'FileText',       locked: true },
  { key: 'relatorios', label: 'Relatórios',  icon: 'BarChart2',      locked: true },
]

export function Sidebar({ page, setPage, isOpen, onClose }) {
  const { usuario, logout } = useAuth()

  return (
    <aside style={{
      width: 220,
      flexShrink: 0,
      background: C.surface,
      borderRight: `1px solid ${C.border}`,
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflow: 'auto',
      // Responsividade mobile: posição fixa fora da tela quando fechada
      transition: 'transform .25s ease, width .25s ease',
    }}
    className={`app-sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}
    >
      {/* Brand */}
      <div style={{ padding: '24px 20px 20px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 10, color: C.accent, fontFamily: 'monospace', letterSpacing: 3, marginBottom: 6 }}>
          SISTEMA
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: C.text, letterSpacing: -0.5, lineHeight: 1.2 }}>
          Controle<br /><span style={{ color: C.accent }}>de Lojas</span>
        </div>
        <div style={{ fontSize: 10, color: C.muted, marginTop: 6, fontFamily: 'monospace' }}>
          v1.0 · {usuario?.empresaNome ?? 'Loja Centro'}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 10px', flex: 1 }}>
        {NAV_ITEMS.map(({ key, icon, label, locked }) => {
          const Icon = ICON_MAP[icon]
          const active = page === key
          return (
            <button
              key={key}
              onClick={() => !locked && setPage(key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '10px 12px', borderRadius: 8,
                border: 'none', background: active ? 'rgba(0,217,168,.1)' : 'none',
                color: locked ? C.muted : active ? C.accent : C.muted2,
                fontSize: 13, fontWeight: active ? 700 : 500,
                cursor: locked ? 'not-allowed' : 'pointer',
                textAlign: 'left', marginBottom: 2, transition: 'background .15s',
              }}
            >
              <Icon size={15} />
              <span style={{ flex: 1 }}>{label}</span>
              {locked && (
                <span style={{
                  fontSize: 9, padding: '2px 6px', borderRadius: 4,
                  background: C.s3, color: C.muted, fontFamily: 'monospace',
                }}>
                  EM BREVE
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* User */}
      <div style={{ padding: '14px 12px', borderTop: `1px solid ${C.border}` }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 8, background: C.s2,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'rgba(0,217,168,.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: C.accent, flexShrink: 0,
          }}>
            {usuario?.nome?.slice(0, 2).toUpperCase() ?? '?'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {usuario?.nome ?? ''}
            </div>
            <div style={{ fontSize: 10, color: C.muted, textTransform: 'capitalize' }}>
              {usuario?.perfil?.toLowerCase() ?? ''}
            </div>
          </div>
          <button
            onClick={logout}
            title="Sair"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center',
              color: C.muted, flexShrink: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.color = C.red}
            onMouseLeave={e => e.currentTarget.style.color = C.muted}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>

      {/* Estilos responsivos injetados uma única vez */}
      <style>{`
        @media (max-width: 767px) {
          .app-sidebar {
            position: fixed !important;
            top: 0;
            left: 0;
            height: 100vh !important;
            z-index: 50;
          }
          .app-sidebar.sidebar-closed {
            transform: translateX(-100%);
          }
          .app-sidebar.sidebar-open {
            transform: translateX(0);
            box-shadow: 4px 0 24px rgba(0,0,0,0.5);
          }
        }
        @media (min-width: 768px) {
          .app-sidebar.sidebar-closed {
            width: 0 !important;
            overflow: hidden;
            border-right: none !important;
          }
          .app-sidebar.sidebar-open {
            width: 220px;
          }
        }
      `}</style>
    </aside>
  )
}
