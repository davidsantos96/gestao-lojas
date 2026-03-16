import { C } from '../../constants/theme'
import { fmtBRL } from '../../utils/format'
import { Card } from '../../components/ui/Card'
import { Tag } from '../../components/ui/Tag'
import { SkeletonTable } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { EmptyState } from '../../components/ui/EmptyState'
import { DollarSign } from 'lucide-react'
import { STATUS_FIN } from '../../data/mock'

export function ContasPagar({ contas, totalPendente, loading, error, onRefetch, onPagar }) {
  if (loading) return <Card><SkeletonTable rows={5} cols={6} /></Card>
  if (error)   return <Card><ErrorState error={error} onRetry={onRefetch} /></Card>
  if (!contas.length) return <Card><EmptyState icon={DollarSign} title="Nenhuma conta a pagar" /></Card>

  return (
    <Card style={{ overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${C.border}` }}>
            {['Descrição', 'Vencimento', 'Categoria', 'Valor', 'Status', ''].map((h, i) => (
              <th key={i} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, color: C.muted, fontFamily: 'monospace', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 500 }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {contas.map((c, i) => {
            const cfg = STATUS_FIN[c.status] ?? STATUS_FIN.pendente
            return (
              <tr key={c.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.015)' }}>
                <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 600, color: C.text }}>{c.descricao}</td>
                <td style={{ padding: '13px 16px', fontSize: 12, color: C.muted, fontFamily: 'monospace' }}>{c.vencimento}</td>
                <td style={{ padding: '13px 16px', fontSize: 12, color: C.muted2 }}>{c.categoria}</td>
                <td style={{ padding: '13px 16px', fontSize: 14, fontWeight: 700, color: C.text }}>{fmtBRL(c.valor)}</td>
                <td style={{ padding: '13px 16px' }}><Tag color={cfg.color} bg={cfg.bg}>{cfg.label}</Tag></td>
                <td style={{ padding: '13px 16px' }}>
                  {c.status !== 'pago' && (
                    <button
                      onClick={() => onPagar?.(c.id)}
                      style={{ padding: '5px 12px', background: 'rgba(0,217,168,.1)', border: `1px solid ${C.accent}44`, borderRadius: 6, color: C.accent, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                    >
                      Pagar
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div style={{ padding: '14px 16px', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'flex-end' }}>
        <span style={{ fontSize: 12, color: C.muted }}>
          Total pendente: <strong style={{ color: C.red }}>{fmtBRL(totalPendente)}</strong>
        </span>
      </div>
    </Card>
  )
}
