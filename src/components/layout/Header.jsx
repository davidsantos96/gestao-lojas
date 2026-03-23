import { useState, useEffect, useContext } from 'react'
import { Bell, Settings, ChevronRight, Menu, X, Sun, Moon } from 'lucide-react'
import { ThemeContext } from '../../contexts/ThemeContext'
import { 
  HeaderContainer, LeftGroup, ToggleSidebarBtn, Breadcrumb, 
  RightGroup, DateTimeDisplay, IconButton 
} from './HeaderStyles'

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
  const { toggleTheme, theme } = useContext(ThemeContext)

  const dateStr = now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  const isLight = theme.title === 'light'

  return (
    <HeaderContainer>
      <LeftGroup>
        <ToggleSidebarBtn onClick={onToggleSidebar} title={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}>
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </ToggleSidebarBtn>

        <Breadcrumb>
          <span>Sistema</span>
          <ChevronRight size={12} style={{ flexShrink: 0 }} />
          <span className="title">{PAGE_LABELS[page]}</span>
        </Breadcrumb>
      </LeftGroup>

      <RightGroup>
        <DateTimeDisplay>
          <span>{dateStr}</span>
          <span className="time-badge">{timeStr}</span>
        </DateTimeDisplay>

        <IconButton onClick={toggleTheme} title="Alternar Tema">
          {isLight ? <Moon size={16} /> : <Sun size={16} />}
        </IconButton>

        <IconButton>
          <Bell size={16} />
          <span className="nav-dot" />
        </IconButton>
        <IconButton>
          <Settings size={16} />
        </IconButton>
      </RightGroup>
    </HeaderContainer>
  )
}
