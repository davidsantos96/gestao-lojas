import { AlertTriangle, RefreshCw } from 'lucide-react'
import { C } from '../../constants/theme'

export function ErrorState({ error, onRetry, message }) {
  const msg = message || error?.message || 'Erro ao carregar dados'
  const isOffline = error?.status === 0

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '48px 24px', gap: 16, textAlign: 'center',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: 'rgba(255,91,107,.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <AlertTriangle size={22} color={C.red} />
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>
          {isOffline ? 'Sem conexão com o servidor' : 'Algo deu errado'}
        </div>
        <div style={{ fontSize: 12, color: C.muted, maxWidth: 320 }}>{msg}</div>
        {error?.status && (
          <div style={{ fontSize: 11, color: C.muted, fontFamily: 'monospace', marginTop: 4 }}>
            Status {error.status}
          </div>
        )}
      </div>
      {onRetry && (
        <button onClick={onRetry} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
          borderRadius: 8, border: `1px solid ${C.border}`,
          background: C.s2, color: C.muted2, fontSize: 13, cursor: 'pointer',
        }}>
          <RefreshCw size={13} /> Tentar novamente
        </button>
      )}
    </div>
  )
}
