import { useState } from 'react'
import { X } from 'lucide-react'
import { C } from '../../constants/theme'
import { fmtBRL } from '../../utils/format'
import { Card } from '../../components/ui/Card'
import { Tag } from '../../components/ui/Tag'
import { SkeletonTable } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { useVendas } from '../../hooks/useVendas'
import { FORMAS_PAGAMENTO } from '../../services/vendasService'

const STATUS_CFG = {
  concluida: { color: C.accent, bg: 'rgba(0,217,168,.12)', label: 'Concluída' },
  cancelada:  { color: C.red,   bg: 'rgba(255,91,107,.12)', label: 'Cancelada' },
}

export function HistoricoVendas() {
  const [filtros,     setFiltros]     = useState({ data_de: '', data_ate: '', cliente: '' })
  const [detalhe,     setDetalhe]     = useState(null)
  const [confirmando, setConfirmando] = useState(null)

  const { vendas, total, loading, error, refetch, cancelar } = useVendas(
    Object.fromEntries(Object.entries(filtros).filter(([, v]) => v))
  )

  const handleCancelar = async (id) => {
    if (confirmando === id) {
      await cancelar(id)
      setConfirmando(null)
      setDetalhe(null)
    } else {
      setConfirmando(id)
      setTimeout(() => setConfirmando(c => c === id ? null : c), 3000)
    }
  }

  const inp = { padding: '8px 12px', background: C.s2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 12, outline: 'none' }

  if (loading) return <Card><SkeletonTable rows={6} cols={6} /></Card>
  if (error)   return <Card><ErrorState error={error} onRetry={refetch} /></Card>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {[['DE', 'data_de'], ['ATÉ', 'data_ate']].map(([label, key]) => (
            <div key={key}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 4, fontFamily: 'monospace' }}>{label}</div>
              <input type="date" value={filtros[key]} onChange={e => setFiltros(f => ({ ...f, [key]: e.target.value }))} style={{ ...inp, colorScheme: 'dark' }} />
            </div>
          ))}
          <div>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 4, fontFamily: 'monospace' }}>CLIENTE</div>
            <input value={filtros.cliente} onChange={e => setFiltros(f => ({ ...f, cliente: e.target.value }))} placeholder="Filtrar..." style={{ ...inp, width: 150 }} />
          </div>
          {Object.values(filtros).some(v => v) && (
            <button onClick={() => setFiltros({ data_de: '', data_ate: '', cliente: '' })}
              style={{ padding: '8px 12px', background: 'none', border: `1px solid ${C.border}`, borderRadius: 8, color: C.muted, fontSize: 12, cursor: 'pointer' }}>
              Limpar
            </button>
          )}
          <span style={{ marginLeft: 'auto', fontSize: 12, color: C.muted }}>{total} venda{total !== 1 ? 's' : ''}</span>
        </div>
      </Card>

      {vendas.length === 0 ? (
        <Card><div style={{ textAlign: 'center', color: C.muted, padding: 32, fontSize: 13 }}>Nenhuma venda encontrada.</div></Card>
      ) : (
        <Card style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {['#', 'Data', 'Cliente', 'Pagamento', 'Itens', 'Total', 'Status', ''].map((h, i) => (
                  <th key={i} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, color: C.muted, fontFamily: 'monospace', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vendas.map((v, i) => {
                const cfg     = STATUS_CFG[v.status] ?? STATUS_CFG.concluida
                const fpLabel = FORMAS_PAGAMENTO.find(f => f.value === v.forma_pagamento)?.label ?? v.forma_pagamento
                const data    = new Date(v.criado_em).toLocaleDateString('pt-BR')
                return (
                  <tr key={v.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.015)', cursor: 'pointer' }}
                    onClick={() => setDetalhe(d => d?.id === v.id ? null : v)}>
                    <td style={{ padding: '13px 14px', fontSize: 12, color: C.muted, fontFamily: 'monospace' }}>#{v.numero}</td>
                    <td style={{ padding: '13px 14px', fontSize: 12, color: C.muted, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{data}</td>
                    <td style={{ padding: '13px 14px', fontSize: 13, color: C.text }}>{v.cliente || <span style={{ color: C.muted }}>—</span>}</td>
                    <td style={{ padding: '13px 14px', fontSize: 12, color: C.muted2 }}>{fpLabel}{v.parcelas > 1 ? ` ${v.parcelas}x` : ''}</td>
                    <td style={{ padding: '13px 14px', fontSize: 12, color: C.muted }}>{v.itens?.length ?? 0}</td>
                    <td style={{ padding: '13px 14px', fontSize: 14, fontWeight: 700, color: v.status === 'cancelada' ? C.muted : C.accent }}>{fmtBRL(v.total_liquido)}</td>
                    <td style={{ padding: '13px 14px' }}><Tag color={cfg.color} bg={cfg.bg}>{cfg.label}</Tag></td>
                    <td style={{ padding: '13px 14px' }}>
                      {v.status === 'concluida' && (
                        <button onClick={e => { e.stopPropagation(); handleCancelar(v.id) }}
                          style={{ padding: '4px 8px', borderRadius: 6, fontSize: 11, cursor: 'pointer', transition: 'all .15s',
                            background: confirmando === v.id ? 'rgba(255,91,107,.15)' : C.s2,
                            border: `1px solid ${confirmando === v.id ? C.red : 'rgba(255,91,107,.3)'}`,
                            color: C.red }}>
                          {confirmando === v.id ? 'Confirmar' : 'Cancelar'}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {detalhe && (
            <div style={{ margin: '0 14px 14px', background: C.s2, borderRadius: 10, padding: 14, border: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.muted2 }}>Itens da Venda #{detalhe.numero}</span>
                <button onClick={() => setDetalhe(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={14} color={C.muted} /></button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>{['Produto', 'SKU', 'Qtd', 'Preço Unit.', 'Subtotal'].map((h, i) => (
                    <th key={i} style={{ padding: '6px 8px', textAlign: 'left', fontSize: 10, color: C.muted, fontFamily: 'monospace', letterSpacing: 1 }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {(detalhe.itens ?? []).map(item => (
                    <tr key={item.id}>
                      <td style={{ padding: '6px 8px', fontSize: 12, color: C.text }}>{item.produto_nome}</td>
                      <td style={{ padding: '6px 8px', fontSize: 11, color: C.muted, fontFamily: 'monospace' }}>{item.produto_sku}</td>
                      <td style={{ padding: '6px 8px', fontSize: 12, color: C.muted }}>{item.quantidade}</td>
                      <td style={{ padding: '6px 8px', fontSize: 12, color: C.muted }}>{fmtBRL(item.preco_unitario)}</td>
                      <td style={{ padding: '6px 8px', fontSize: 13, fontWeight: 700, color: C.accent }}>{fmtBRL(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {detalhe.desconto > 0 && <div style={{ textAlign: 'right', fontSize: 12, color: C.red, marginTop: 6 }}>Desconto: − {fmtBRL(detalhe.desconto)}</div>}
              <div style={{ textAlign: 'right', fontSize: 14, fontWeight: 700, color: C.text, marginTop: 4 }}>
                Total: <span style={{ color: C.accent }}>{fmtBRL(detalhe.total_liquido)}</span>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
