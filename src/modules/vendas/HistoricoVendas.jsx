import { useState } from 'react'
import { X, Filter, Search, ChevronDown } from 'lucide-react'
import { C } from '../../constants/theme'
import { fmtBRL } from '../../utils/format'
import { Card } from '../../components/ui/Card'
import { Tag } from '../../components/ui/Tag'
import { SkeletonTable } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { useVendas } from '../../hooks/useVendas'
import { cancelarVenda, FORMAS_PAGAMENTO } from '../../services/vendasService'

const STATUS_CFG = {
  concluida: { color: C.accent,  bg: 'rgba(0,217,168,.12)',  label: 'Concluída' },
  cancelada:  { color: C.red,    bg: 'rgba(255,91,107,.12)', label: 'Cancelada' },
}

const inp = {
  padding: '9px 12px', background: 'rgba(255,255,255,.04)',
  border: `1px solid ${C.border}`, borderRadius: 9,
  color: C.text, fontSize: 12, outline: 'none', transition: 'border-color .15s',
}
const lbl = { fontSize: 10, color: C.muted, fontFamily: 'monospace', letterSpacing: 1.5, textTransform: 'uppercase', display: 'block', marginBottom: 5 }

export function HistoricoVendas() {
  const [filtros,     setFiltros]     = useState({ data_de: '', data_ate: '', cliente: '' })
  const [detalhe,     setDetalhe]     = useState(null)
  const [confirmando, setConfirmando] = useState(null)

  const { vendas, pagination, loading, error, refetch } = useVendas(
    Object.fromEntries(Object.entries(filtros).filter(([, v]) => v))
  )

  const total = pagination?.total ?? 0

  const handleCancelar = async (id) => {
    if (confirmando === id) {
      await cancelarVenda(id)
      refetch()
      setConfirmando(null)
      setDetalhe(null)
    } else {
      setConfirmando(id)
      setTimeout(() => setConfirmando(c => c === id ? null : c), 3000)
    }
  }

  const hasFilters = Object.values(filtros).some(v => v)

  if (loading) return <Card><SkeletonTable rows={6} cols={6} /></Card>
  if (error)   return <Card><ErrorState error={error} onRetry={refetch} /></Card>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Barra de filtros */}
      <Card style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginRight: 4 }}>
            <Filter size={13} color={C.muted} />
            <span style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>Filtros</span>
          </div>

          {[['De', 'data_de'], ['Até', 'data_ate']].map(([label, key]) => (
            <div key={key}>
              <label style={lbl}>{label}</label>
              <input
                type="date"
                value={filtros[key]}
                onChange={e => setFiltros(f => ({ ...f, [key]: e.target.value }))}
                style={{ ...inp, colorScheme: 'dark' }}
              />
            </div>
          ))}

          <div>
            <label style={lbl}>Cliente</label>
            <div style={{ position: 'relative' }}>
              <Search size={12} color={C.muted} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                value={filtros.cliente}
                onChange={e => setFiltros(f => ({ ...f, cliente: e.target.value }))}
                placeholder="Filtrar cliente…"
                style={{ ...inp, paddingLeft: 28, width: 160 }}
              />
            </div>
          </div>

          {hasFilters && (
            <button
              onClick={() => setFiltros({ data_de: '', data_ate: '', cliente: '' })}
              style={{
                padding: '9px 14px', background: 'none',
                border: `1px solid ${C.border}`, borderRadius: 9,
                color: C.muted, fontSize: 12, cursor: 'pointer', transition: 'all .15s',
              }}
            >
              Limpar filtros
            </button>
          )}

          <div style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
            background: C.s2, border: `1px solid ${C.border}`,
            borderRadius: 8, padding: '6px 12px',
          }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: C.text }}>{total}</span>
            <span style={{ fontSize: 12, color: C.muted }}>venda{total !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </Card>

      {/* Tabela / Empty */}
      {vendas.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', color: C.muted, padding: '48px 0', fontSize: 13 }}>
            {hasFilters ? 'Nenhuma venda encontrada para os filtros aplicados.' : 'Nenhuma venda registrada ainda.'}
          </div>
        </Card>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: C.s2, borderBottom: `1px solid ${C.border}` }}>
                {['#', 'Data', 'Cliente', 'Pagamento', 'Itens', 'Total', 'Status', ''].map((h, i) => (
                  <th key={i} style={{
                    padding: '13px 16px', textAlign: 'left',
                    fontSize: 10, color: C.muted, fontFamily: 'monospace',
                    letterSpacing: 1.5, textTransform: 'uppercase',
                    fontWeight: 600, whiteSpace: 'nowrap',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vendas.map((v, i) => {
                const cfg     = STATUS_CFG[v.status] ?? STATUS_CFG.concluida
                const fpLabel = FORMAS_PAGAMENTO.find(f => f.value === v.forma_pagamento)?.label ?? v.forma_pagamento
                const data    = new Date(v.criado_em).toLocaleDateString('pt-BR')
                const isOpen  = detalhe?.id === v.id
                return (
                  <>
                    <tr
                      key={v.id}
                      onClick={() => setDetalhe(d => d?.id === v.id ? null : v)}
                      style={{
                        borderBottom: isOpen ? 'none' : `1px solid ${C.border}`,
                        background: isOpen ? `${C.accent}08` : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.015)',
                        cursor: 'pointer', transition: 'background .12s',
                      }}
                    >
                      <td style={{ padding: '14px 16px', fontSize: 12, color: C.muted, fontFamily: 'monospace', fontWeight: 600 }}>
                        #{v.numero}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: C.muted, whiteSpace: 'nowrap' }}>
                        {data}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: C.text, fontWeight: 500 }}>
                        {v.cliente || <span style={{ color: C.muted }}>—</span>}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: C.muted2, whiteSpace: 'nowrap' }}>
                        {fpLabel}{v.parcelas > 1 ? ` · ${v.parcelas}x` : ''}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: C.muted }}>
                        <span style={{
                          background: C.s2, border: `1px solid ${C.border}`,
                          borderRadius: 5, padding: '2px 7px', fontSize: 11,
                        }}>
                          {v.itens?.length ?? 0}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 15, fontWeight: 800, color: v.status === 'cancelada' ? C.muted : C.accent }}>
                        {fmtBRL(v.total_liquido)}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <Tag color={cfg.color} bg={cfg.bg}>{cfg.label}</Tag>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {v.status === 'concluida' && (
                            <button
                              onClick={e => { e.stopPropagation(); handleCancelar(v.id) }}
                              style={{
                                padding: '4px 10px', borderRadius: 7, fontSize: 11,
                                cursor: 'pointer', transition: 'all .15s',
                                background: confirmando === v.id ? 'rgba(255,91,107,.15)' : 'transparent',
                                border: `1px solid ${confirmando === v.id ? C.red : 'rgba(255,91,107,.3)'}`,
                                color: C.red, whiteSpace: 'nowrap',
                              }}
                            >
                              {confirmando === v.id ? '⚠ Confirmar' : 'Cancelar'}
                            </button>
                          )}
                          <ChevronDown
                            size={14} color={C.muted}
                            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .2s', flexShrink: 0 }}
                          />
                        </div>
                      </td>
                    </tr>

                    {/* Detalhe inline */}
                    {isOpen && (
                      <tr key={`${v.id}-detail`}>
                        <td colSpan={8} style={{ padding: 0, borderBottom: `1px solid ${C.border}` }}>
                          <div style={{
                            margin: '0 16px 16px',
                            background: C.s2, borderRadius: 10,
                            border: `1px solid ${C.border}`, overflow: 'hidden',
                          }}>
                            {/* Header do detalhe */}
                            <div style={{
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                              padding: '12px 14px', borderBottom: `1px solid ${C.border}`,
                              background: 'rgba(0,0,0,.15)',
                            }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: C.muted2 }}>
                                Itens da Venda #{detalhe.numero}
                              </span>
                              <button onClick={() => setDetalhe(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                                <X size={14} color={C.muted} />
                              </button>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                              <thead>
                                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                                  {['Produto', 'SKU', 'Qtd', 'Preço Unit.', 'Subtotal'].map((h, i) => (
                                    <th key={i} style={{
                                      padding: '8px 14px', textAlign: i >= 2 ? 'right' : 'left',
                                      fontSize: 10, color: C.muted, fontFamily: 'monospace',
                                      letterSpacing: 1, fontWeight: 500,
                                    }}>
                                      {h}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {(detalhe.itens ?? []).map(item => (
                                  <tr key={item.id} style={{ borderBottom: `1px solid rgba(255,255,255,.04)` }}>
                                    <td style={{ padding: '9px 14px', fontSize: 12, color: C.text, fontWeight: 500 }}>{item.produto_nome}</td>
                                    <td style={{ padding: '9px 14px', fontSize: 11, color: C.muted, fontFamily: 'monospace' }}>{item.produto_sku}</td>
                                    <td style={{ padding: '9px 14px', fontSize: 12, color: C.muted, textAlign: 'right' }}>{item.quantidade}</td>
                                    <td style={{ padding: '9px 14px', fontSize: 12, color: C.muted, textAlign: 'right' }}>{fmtBRL(item.preco_unitario)}</td>
                                    <td style={{ padding: '9px 14px', fontSize: 13, fontWeight: 700, color: C.accent, textAlign: 'right' }}>{fmtBRL(item.subtotal)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>

                            <div style={{ padding: '10px 14px', borderTop: `1px solid ${C.border}`, textAlign: 'right' }}>
                              {detalhe.desconto > 0 && (
                                <div style={{ fontSize: 12, color: C.red, marginBottom: 4 }}>
                                  Desconto: − {fmtBRL(detalhe.desconto)}
                                </div>
                              )}
                              <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>
                                Total: <span style={{ color: C.accent }}>{fmtBRL(detalhe.total_liquido)}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
