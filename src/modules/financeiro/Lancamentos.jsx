import { useState } from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import { C } from '../../constants/theme'
import { fmtBRL } from '../../utils/format'
import { Card } from '../../components/ui/Card'
import { Tag } from '../../components/ui/Tag'
import { SkeletonTable } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'

const TIPO_CFG = {
  RECEITA: { color: C.accent, bg: 'rgba(0,217,168,.12)', label: 'Receita' },
  DESPESA: { color: C.red,   bg: 'rgba(255,91,107,.12)', label: 'Despesa' },
}

export function Lancamentos({ titulo, lancamentos = [], total = 0, loading, error, onRefetch, onEditar, onRemover }) {
  const [confirmando, setConfirmando] = useState(null)

  const handleRemover = (id) => {
    if (confirmando === id) {
      onRemover?.(id)
      setConfirmando(null)
    } else {
      setConfirmando(id)
      setTimeout(() => setConfirmando(c => c === id ? null : c), 3000)
    }
  }

  const sectionStyle = { marginTop: 28, paddingTop: 20, borderTop: `1px solid ${C.border}` }
  const headerStyle  = { fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: C.muted, fontFamily: 'monospace', marginBottom: 14 }

  if (loading) return <div style={sectionStyle}>{titulo && <p style={headerStyle}>{titulo}</p>}<Card><SkeletonTable rows={4} cols={5} /></Card></div>
  if (error)   return <div style={sectionStyle}>{titulo && <p style={headerStyle}>{titulo}</p>}<Card><ErrorState error={error} onRetry={onRefetch} /></Card></div>
  if (!lancamentos.length) return null

  return (
    <div style={sectionStyle}>
      {titulo && (
        <p style={headerStyle}>
          {titulo}
          <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: 'none', marginLeft: 6, color: C.muted2 }}>({total})</span>
        </p>
      )}
      <Card style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Data', 'Tipo', 'Descrição', 'Valor', ''].map((h, i) => (
                <th key={i} style={{
                  padding: '12px 16px', textAlign: i === 3 ? 'right' : 'left',
                  fontSize: 11, color: C.muted, fontFamily: 'monospace',
                  letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 500, whiteSpace: 'nowrap',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lancamentos.map((l, i) => {
              const cfg  = TIPO_CFG[l.tipo] ?? TIPO_CFG.DESPESA
              const data = l.data 
                ? (l.data.includes('/') ? l.data : l.data.split('T')[0].split('-').reverse().join('/'))
                : '—'
              return (
                <tr key={l.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.015)' }}>
                  <td style={{ padding: '13px 16px', fontSize: 12, color: C.muted, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{data}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <Tag color={cfg.color} bg={cfg.bg}>{cfg.label}</Tag>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 600, color: C.text }}>{l.descricao}</td>
                  <td style={{ padding: '13px 16px', fontSize: 14, fontWeight: 700, color: cfg.color, textAlign: 'right', fontFamily: 'monospace' }}>
                    {l.tipo === 'DESPESA' ? '−' : '+'}{fmtBRL(l.valor)}
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      {onEditar && (
                        <button onClick={() => onEditar(l)} title="Editar"
                          style={{ padding: '5px 7px', background: C.s2, border: `1px solid ${C.border}`, borderRadius: 6, cursor: 'pointer' }}>
                          <Edit2 size={13} color={C.muted2} />
                        </button>
                      )}
                      {onRemover && (
                        <button onClick={() => handleRemover(l.id)}
                          title={confirmando === l.id ? 'Confirmar exclusão' : 'Excluir'}
                          style={{
                            padding: '5px 7px', borderRadius: 6, cursor: 'pointer', transition: 'all .15s',
                            background: confirmando === l.id ? 'rgba(255,91,107,.15)' : C.s2,
                            border: `1px solid ${confirmando === l.id ? C.red : 'rgba(255,91,107,.3)'}`,
                            display: 'flex', alignItems: 'center', gap: confirmando === l.id ? 4 : 0
                          }}>
                          <Trash2 size={13} color={C.red} />
                          {confirmando === l.id && <span style={{ fontSize: 10, color: C.red, fontWeight: 600 }}>Confirmar?</span>}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
