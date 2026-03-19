import { useState, useEffect, lazy, Suspense } from 'react'
import { C } from './constants/theme'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { LoginPage } from './modules/auth/LoginPage'
import { useAuth } from './hooks/useAuth'
import { SkeletonTable } from './components/ui/Skeleton'

// Lazy loading — cada módulo só é baixado quando acessado pela primeira vez
const Dashboard  = lazy(() => import('./modules/dashboard/Dashboard').then(m => ({ default: m.Dashboard })))
const Estoque    = lazy(() => import('./modules/estoque/Estoque').then(m => ({ default: m.Estoque })))
const Financeiro = lazy(() => import('./modules/financeiro/Financeiro').then(m => ({ default: m.Financeiro })))
const Vendas     = lazy(() => import('./modules/vendas/Vendas').then(m => ({ default: m.Vendas })))

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
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: C.bg, color: C.muted,
        fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: `${C.accent}18`, border: `1px solid ${C.accent}30`,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16, animation: 'pulse 1.5s ease-in-out infinite',
          }}>
            <div style={{
              width: 16, height: 16, borderRadius: '50%',
              border: `2px solid ${C.accent}`, borderTopColor: 'transparent',
              animation: 'spin 0.8s linear infinite',
            }} />
          </div>
          <div>Carregando...</div>
        </div>
        <style>{`
          @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          @keyframes pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
        `}</style>
      </div>
    )
  }

  // Se não logou, mostra login
  if (!usuario) {
    return <LoginPage />
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, color: C.text, fontFamily: 'system-ui, sans-serif', position: 'relative' }}>
      <Sidebar page={page} setPage={navigate} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Overlay escuro para mobile quando sidebar está aberta */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            display: 'none',
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
            zIndex: 49,
            // Visível apenas em mobile via CSS
          }}
          className="sidebar-overlay"
        />
      )}

      <main style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
        <Header page={page} onToggleSidebar={() => setSidebarOpen(o => !o)} sidebarOpen={sidebarOpen} />
        <div style={{ padding: '24px 20px' }} className="main-content">
          <Suspense fallback={<ModuleFallback />}>
            {page === 'dashboard'  && <Dashboard setPage={navigate} />}
            {page === 'vendas'     && <Vendas />}
            {page === 'estoque'    && <Estoque />}
            {page === 'financeiro' && <Financeiro />}
          </Suspense>
        </div>
      </main>

      <style>{`
        @media (max-width: 767px) {
          .sidebar-overlay { display: block !important; }
          .main-content { padding: 16px 12px !important; }
        }
      `}</style>
    </div>
  )
}
