import { useState, lazy, Suspense } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { LoginPage } from './modules/auth/LoginPage'
import { useAuth } from './hooks/useAuth'
import { SkeletonTable } from './components/ui/Skeleton'
import {
  LoadingContainer, LoadingBox, LoadingIconWrap, Spinner,
  AppContainer, SidebarOverlay, MainArea, MainContent
} from './AppStyles'

// Lazy loading — cada módulo só é baixado quando acessado pela primeira vez
const Dashboard  = lazy(() => import('./modules/dashboard/Dashboard').then(m => ({ default: m.Dashboard })))
const Estoque    = lazy(() => import('./modules/estoque/Estoque').then(m => ({ default: m.Estoque })))
const Financeiro = lazy(() => import('./modules/financeiro/Financeiro').then(m => ({ default: m.Financeiro })))
const Vendas     = lazy(() => import('./modules/vendas/Vendas').then(m => ({ default: m.Vendas })))
const Clientes   = lazy(() => import('./modules/clientes/Clientes').then(m => ({ default: m.Clientes })))

function ModuleFallback() {
  return <div><SkeletonTable rows={6} cols={5} /></div>
}

export default function App() {
  const [page, setPage] = useState('dashboard')
  const { usuario, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768)

  // Fecha a sidebar automaticamente em telas pequenas ao trocar de página
  function navigate(p) {
    setPage(p)
    if (window.innerWidth < 768) setSidebarOpen(false)
  }

  // Tela de carregamento durante verificação de sessão
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingBox>
          <LoadingIconWrap>
            <Spinner />
          </LoadingIconWrap>
          <div>Carregando...</div>
        </LoadingBox>
      </LoadingContainer>
    )
  }

  // Se não logou, mostra login
  if (!usuario) {
    return <LoginPage />
  }

  return (
    <AppContainer>
      <Sidebar page={page} setPage={navigate} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Overlay escuro para mobile quando sidebar está aberta */}
      {sidebarOpen && (
        <SidebarOverlay onClick={() => setSidebarOpen(false)} />
      )}

      <MainArea>
        <Header page={page} onToggleSidebar={() => setSidebarOpen(o => !o)} sidebarOpen={sidebarOpen} />
        <MainContent>
          <Suspense fallback={<ModuleFallback />}>
            {page === 'dashboard'  && <Dashboard setPage={navigate} />}
            {page === 'vendas'     && <Vendas />}
            {page === 'estoque'    && <Estoque />}
            {page === 'financeiro' && <Financeiro />}
            {page === 'clientes'   && <Clientes />}
          </Suspense>
        </MainContent>
      </MainArea>
    </AppContainer>
  )
}
