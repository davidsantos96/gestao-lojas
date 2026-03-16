import { useState } from 'react'
import { C } from './constants/theme'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { Dashboard } from './modules/dashboard/Dashboard'
import { Estoque } from './modules/estoque/Estoque'
import { Financeiro } from './modules/financeiro/Financeiro'

export default function App() {
  const [page, setPage] = useState('dashboard')

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
