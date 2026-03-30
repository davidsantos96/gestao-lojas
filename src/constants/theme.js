export const C = {
  bg:      'var(--c-bg)',
  surface: 'var(--c-surface)',
  s2:      'var(--c-s2)',
  s3:      'var(--c-s3)',
  border:  'var(--c-border)',
  b2:      'var(--c-b2)',
  accent:  'var(--c-accent)',
  accentD: 'var(--c-accentD)',
  blue:    'var(--c-blue)',
  blueD:   'var(--c-blueD)',
  red:     'var(--c-red)',
  yellow:  'var(--c-yellow)',
  purple:  'var(--c-purple)',
  text:    'var(--c-text)',
  muted:   'var(--c-muted)',
  muted2:  'var(--c-muted2)',
}

export const NAV_ITEMS = [
  { key: 'dashboard',  label: 'Dashboard',  icon: 'LayoutDashboard' },
  { key: 'estoque',    label: 'Estoque',     icon: 'Boxes' },
  { key: 'financeiro', label: 'Financeiro',  icon: 'Wallet' },
  { key: 'vendas',     label: 'Vendas',      icon: 'ShoppingCart',  locked: true },
  { key: 'clientes',   label: 'Clientes',    icon: 'Users',         locked: true },
  { key: 'fiscal',     label: 'Fiscal',      icon: 'FileText',      locked: true },
  { key: 'relatorios', label: 'Relatórios',  icon: 'BarChart2' },
]
