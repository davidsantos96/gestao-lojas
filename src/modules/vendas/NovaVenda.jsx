import { useState } from 'react'
import { Plus, Minus, Trash2, ShoppingCart, CheckCircle, Search } from 'lucide-react'
import { C } from '../../constants/theme'
import { fmtBRL } from '../../utils/format'
import { Card } from '../../components/ui/Card'
import { useCarrinho } from '../../hooks/useVendas'
import { FORMAS_PAGAMENTO } from '../../services/vendasService'

export function NovaVenda({ produtos = [], onVendaConcluida }) {
  const [busca, setBusca] = useState('')
  const [vendaConcluida, setVendaConcluida] = useState(null)

  const {
    itens, cliente, formaPagamento, parcelas, desconto,
    totalBruto, totalLiquido, loading, erro,
    setCliente, setFormaPagamento, setParcelas, setDesconto,
    adicionarItem, removerItem, atualizarQtd, limpar, finalizar,
  } = useCarrinho()

  const produtosFiltrados = produtos.filter(p =>
    p.estoque > 0 && (
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.sku.toLowerCase().includes(busca.toLowerCase())
    )
  )

  const handleFinalizar = async () => {
    const venda = await finalizar()
    if (venda) { setVendaConcluida(venda); onVendaConcluida?.() }
  }

  const inp = { width: '100%', padding: '9px 12px', background: C.s2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, outline: 'none' }
  const lbl = { fontSize: 11, color: C.muted, fontFamily: 'monospace', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 5 }

  if (vendaConcluida) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60, gap: 16 }}>
      <CheckCircle size={56} color={C.accent} />
      <h3 style={{ fontSize: 22, fontWeight: 700, color: C.text }}>Venda #{vendaConcluida.numero} registrada!</h3>
      <p style={{ color: C.muted, fontSize: 14 }}>
        {vendaConcluida.cliente && <><strong style={{ color: C.muted2 }}>{vendaConcluida.cliente}</strong> · </>}
        {fmtBRL(vendaConcluida.total_liquido)} · {FORMAS_PAGAMENTO.find(f => f.value === vendaConcluida.forma_pagamento)?.label}
      </p>
      <button onClick={() => setVendaConcluida(null)}
        style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: C.accent, color: '#0b1a14', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
        Nova Venda
      </button>
    </div>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, alignItems: 'start' }}>

      {/* Produtos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Search size={16} color={C.muted} />
            <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar produto por nome ou SKU..."
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: C.text, fontSize: 13 }} />
          </div>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
          {produtosFiltrados.slice(0, 24).map(p => {
            const noCarrinho = itens.find(i => i.produto_id === p.id)
            return (
              <button key={p.id} onClick={() => adicionarItem(p)} style={{
                background: noCarrinho ? `${C.accent}18` : C.surface,
                border: `1.5px solid ${noCarrinho ? C.accent : C.border}`,
                borderRadius: 10, padding: 12, cursor: 'pointer', textAlign: 'left', transition: 'all .12s',
              }}>
                <div style={{ fontSize: 10, color: C.muted, fontFamily: 'monospace', marginBottom: 4 }}>{p.sku}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6, lineHeight: 1.3 }}>{p.nome}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.accent }}>{fmtBRL(p.preco)}</span>
                  <span style={{ fontSize: 11, color: C.muted }}>est: {p.estoque}</span>
                </div>
              </button>
            )
          })}
          {produtosFiltrados.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: C.muted, padding: 32, fontSize: 13 }}>
              Nenhum produto encontrado com estoque disponível.
            </div>
          )}
        </div>
      </div>

      {/* Carrinho */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 0 }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <ShoppingCart size={16} color={C.blue} />
            <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Carrinho</span>
            {itens.length > 0 && <span style={{ marginLeft: 'auto', fontSize: 11, color: C.muted, cursor: 'pointer' }} onClick={limpar}>limpar</span>}
          </div>

          {itens.length === 0 ? (
            <div style={{ textAlign: 'center', color: C.muted, padding: '24px 0', fontSize: 13 }}>Clique em um produto para adicionar</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {itens.map(item => (
                <div key={item.produto_id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.nome}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{fmtBRL(item.preco_unitario)} × {item.quantidade}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button onClick={() => atualizarQtd(item.produto_id, item.quantidade - 1)} style={{ width: 22, height: 22, borderRadius: 5, border: `1px solid ${C.border}`, background: C.s2, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Minus size={10} color={C.muted} />
                    </button>
                    <span style={{ width: 24, textAlign: 'center', fontSize: 13, color: C.text }}>{item.quantidade}</span>
                    <button onClick={() => atualizarQtd(item.produto_id, item.quantidade + 1)} disabled={item.quantidade >= item.estoque} style={{ width: 22, height: 22, borderRadius: 5, border: `1px solid ${C.border}`, background: C.s2, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Plus size={10} color={C.muted} />
                    </button>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.text, minWidth: 60, textAlign: 'right' }}>{fmtBRL(item.preco_unitario * item.quantidade)}</span>
                  <button onClick={() => removerItem(item.produto_id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                    <Trash2 size={13} color={C.red} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <label style={lbl}>Cliente (opcional)</label>
              <input value={cliente} onChange={e => setCliente(e.target.value)} placeholder="Nome do cliente..." style={inp} />
            </div>
            <div>
              <label style={lbl}>Forma de Pagamento</label>
              <select value={formaPagamento} onChange={e => setFormaPagamento(e.target.value)} style={inp}>
                {FORMAS_PAGAMENTO.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
            {formaPagamento === 'CARTAO_CREDITO' && (
              <div>
                <label style={lbl}>Parcelas</label>
                <select value={parcelas} onChange={e => setParcelas(Number(e.target.value))} style={inp}>
                  {[1,2,3,4,6,8,10,12].map(n => <option key={n} value={n}>{n === 1 ? 'À vista' : `${n}x`}</option>)}
                </select>
              </div>
            )}
            <div>
              <label style={lbl}>Desconto (R$)</label>
              <input type="number" min="0" step="0.01" value={desconto} onChange={e => setDesconto(Number(e.target.value))} style={inp} placeholder="0,00" />
            </div>

            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.muted }}>
                <span>Subtotal</span><span>{fmtBRL(totalBruto)}</span>
              </div>
              {desconto > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.red }}>
                  <span>Desconto</span><span>- {fmtBRL(desconto)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: C.text, marginTop: 4 }}>
                <span>Total</span><span style={{ color: C.accent }}>{fmtBRL(totalLiquido)}</span>
              </div>
            </div>

            {erro && (
              <div style={{ fontSize: 12, color: C.red, background: 'rgba(255,91,107,.08)', border: `1px solid rgba(255,91,107,.25)`, borderRadius: 8, padding: '8px 12px' }}>
                {erro}
              </div>
            )}

            <button onClick={handleFinalizar} disabled={loading || !itens.length} style={{
              padding: 13, borderRadius: 10, border: 'none', fontWeight: 700, fontSize: 14,
              background: loading || !itens.length ? C.accentD : C.accent,
              color: '#0b1a14', cursor: loading || !itens.length ? 'not-allowed' : 'pointer', transition: 'all .15s',
            }}>
              {loading ? 'Registrando...' : '✓ Finalizar Venda'}
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
