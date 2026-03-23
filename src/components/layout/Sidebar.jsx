import {
  LayoutDashboard, Boxes, Wallet, ShoppingCart,
  Users, FileText, BarChart2, LogOut,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import {
  Aside, BrandArea, BrandSystem, BrandTitle, BrandVersion, NavArea, NavItemBtn, NavBadge,
  UserArea, UserCard, UserAvatar, UserInfo, UserName, UserRole, LogoutBtn
} from './SidebarStyles'

const ICON_MAP = { LayoutDashboard, Boxes, Wallet, ShoppingCart, Users, FileText, BarChart2 }

const NAV_ITEMS = [
  { key: 'dashboard',  label: 'Dashboard',  icon: 'LayoutDashboard' },
  { key: 'estoque',    label: 'Estoque',    icon: 'Boxes'           },
  { key: 'financeiro', label: 'Financeiro', icon: 'Wallet'          },
  { key: 'vendas',     label: 'Vendas',     icon: 'ShoppingCart'    },
  { key: 'clientes',   label: 'Clientes',   icon: 'Users',          locked: true },
  { key: 'fiscal',     label: 'Fiscal',     icon: 'FileText',       locked: true },
  { key: 'relatorios', label: 'Relatórios', icon: 'BarChart2',      locked: true },
]

export function Sidebar({ page, setPage, isOpen, onClose }) {
  const { usuario, logout } = useAuth()

  return (
    <Aside $isOpen={isOpen} className="app-sidebar">
      {/* Brand */}
      <BrandArea>
        <BrandSystem>SISTEMA</BrandSystem>
        <BrandTitle>
          Controle<br /><span>de Lojas</span>
        </BrandTitle>
        <BrandVersion>
          v1.0 · {usuario?.empresaNome ?? 'Loja Centro'}
        </BrandVersion>
      </BrandArea>

      {/* Nav */}
      <NavArea>
        {NAV_ITEMS.map(({ key, icon, label, locked }) => {
          const Icon = ICON_MAP[icon]
          const active = page === key
          return (
            <NavItemBtn
              key={key}
              onClick={() => !locked && setPage(key)}
              $active={active}
              $locked={locked}
            >
              <Icon size={15} />
              <span>{label}</span>
              {locked && (
                <NavBadge>EM BREVE</NavBadge>
              )}
            </NavItemBtn>
          )
        })}
      </NavArea>

      {/* User */}
      <UserArea>
        <UserCard>
          <UserAvatar>
            {usuario?.nome?.slice(0, 2).toUpperCase() ?? '?'}
          </UserAvatar>
          <UserInfo>
            <UserName>
              {usuario?.nome ?? ''}
            </UserName>
            <UserRole>
              {usuario?.perfil?.toLowerCase() ?? ''}
            </UserRole>
          </UserInfo>
          <LogoutBtn onClick={logout} title="Sair">
            <LogOut size={14} />
          </LogoutBtn>
        </UserCard>
      </UserArea>
    </Aside>
  )
}
