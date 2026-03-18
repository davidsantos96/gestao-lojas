import { useState } from 'react'
import { C } from './constants/theme'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { Dashboard } from './modules/dashboard/Dashboard'
import { Estoque } from './modules/estoque/Estoque'
import { Financeiro } from './modules/financeiro/Financeiro'
import { LoginPage } from './modules/auth/LoginPage'
import { useAuth } from './hooks/useAuth'

export default function App() {
  const [page, setPage] = useState('dashboard')
  const { usuario, loading } = useAuth()

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
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, color: C.text, fontFamily: 'system-ui, sans-serif' }}>
      <Sidebar page={page} setPage={setPage} />

      <main style={{ flex: 1, overflow: 'auto' }}>
        <Header page={page} />
        <div style={{ padding: 32 }}>
          {page === 'dashboard'  && <Dashboard setPage={setPage} />}
          {page === 'estoque'    && <Estoque />}
          {page === 'financeiro' && <Financeiro />}
        </div>
      </main>
    </div>
  )
}
