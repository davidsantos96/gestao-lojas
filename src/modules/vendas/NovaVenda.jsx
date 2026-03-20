import { useState } from 'react'
import { Plus, Minus, Trash2, ShoppingCart, CheckCircle, Search, Package, Tag as TagIcon } from 'lucide-react'
import { C } from '../../constants/theme'
import { fmtBRL } from '../../utils/format'
import { Card } from '../../components/ui/Card'
import { useCarrinho } from '../../hooks/useVendas'
import { FORMAS_PAGAMENTO } from '../../services/vendasService'

/* ─── sub-estilos reutilizáveis ─── */
const inp = {
  width: '100%', padding: '10px 13px',
  background: 'rgba(255,255,255,.04)', border: `1px solid ${C.border}`,
  borderRadius: 9, color: C.text, fontSize: 13, outline: 'none',
  transition: 'border-color .15s', boxSizing: 'border-box',
  colorScheme: 'dark',
}
const lbl = {
  fontSize: 10, color: C.muted, fontFamily: 'monospace',
  letterSpacing: 1.5, textTransform: 'uppercase', display: 'block', marginBottom: 6,
}

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

  /* ── Tela de sucesso ── */
  if (vendaConcluida) return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '72px 40px', gap: 20,
      background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`,
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: `${C.accent}18`, border: `2px solid ${C.accent}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <CheckCircle size={40} color={C.accent} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: 22, fontWeight: 800, color: C.text, margin: '0 0 8px' }}>
          Venda #{vendaConcluida.numero} registrada!
        </h3>
        <p style={{ color: C.muted, fontSize: 14, margin: 0, lineHeight: 1.6 }}>
          {vendaConcluida.cliente && (
            <><strong style={{ color: C.muted2 }}>{vendaConcluida.cliente}</strong> &middot; </>
          )}
          <span style={{ color: C.accent, fontWeight: 700 }}>{fmtBRL(vendaConcluida.total_liquido)}</span>
          {' '}&middot; {FORMAS_PAGAMENTO.find(f => f.value === vendaConcluida.forma_pagamento)?.label}
        </p>
      </div>
      <button
        onClick={() => setVendaConcluida(null)}
        style={{
          padding: '11px 28px', borderRadius: 10, border: 'none',
          background: C.accent, color: '#051a12', fontWeight: 700,
          fontSize: 13, cursor: 'pointer', marginTop: 4,
          transition: 'opacity .15s',
        }}
      >
        + Nova Venda
      </button>
    </div>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, alignItems: 'start' }}>

      {/* ── Coluna Esquerda: Produtos ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Barra de busca */}
        <Card style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Search size={15} color={C.muted} style={{ flexShrink: 0 }} />
            <input
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder="Buscar produto por nome ou SKU…"
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: C.text, fontSize: 13 }}
            />
            {busca && (
              <button
                onClick={() => setBusca('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 11 }}
              >
                limpar
              </button>
            )}
          </div>
        </Card>

        {/* Contador de resultados */}
        {busca && (
          <div style={{ fontSize: 12, color: C.muted, paddingLeft: 2 }}>
            {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? 's' : ''} encontrado{produtosFiltrados.length !== 1 ? 's' : ''}
          </div>
        )}

        {/* Grid de produtos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(168px, 1fr))', gap: 10 }}>
          {produtosFiltrados.slice(0, 24).map(p => {
            const noCarrinho = itens.find(i => i.produto_id === p.id)
            return (
              <button
                key={p.id}
                onClick={() => adicionarItem(p)}
                style={{
                  background: noCarrinho ? `${C.accent}14` : C.surface,
                  border: `1.5px solid ${noCarrinho ? C.accent : C.border}`,
                  borderRadius: 12, padding: 14, cursor: 'pointer',
                  textAlign: 'left', transition: 'all .14s',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {noCarrinho && (
                  <div style={{
                    position: 'absolute', top: 8, right: 8,
                    width: 18, height: 18, borderRadius: '50%',
                    background: C.accent, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700, color: '#051a12',
                  }}>
                    {noCarrinho.quantidade}
                  </div>
                )}
                <div style={{ fontSize: 10, color: C.muted, fontFamily: 'monospace', letterSpacing: 0.5, marginBottom: 5 }}>
                  {p.sku}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 8, lineHeight: 1.3, paddingRight: noCarrinho ? 20 : 0 }}>
                  {p.nome}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.accent }}>{fmtBRL(p.preco)}</span>
                  <span style={{
                    fontSize: 10, color: C.muted,
                    background: C.s2, padding: '2px 6px', borderRadius: 5,
                    border: `1px solid ${C.border}`,
                  }}>
                    {p.estoque} un
                  </span>
                </div>
              </button>
            )
          })}

          {produtosFiltrados.length === 0 && (
            <div style={{
              gridColumn: '1/-1', textAlign: 'center', color: C.muted,
              padding: '48px 0', fontSize: 13,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            }}>
              <Package size={32} color={C.border} />
              <span>Nenhum produto disponível em estoque.</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Coluna Direita: Carrinho ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'sticky', top: 0 }}>
        <Card style={{ padding: 0, overflow: 'hidden' }}>

          {/* Cabeçalho do carrinho */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 9,
            padding: '16px 18px', borderBottom: `1px solid ${C.border}`,
            background: `${C.s2}`,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: `${C.blue}18`, border: `1px solid ${C.blue}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShoppingCart size={15} color={C.blue} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Carrinho</div>
              <div style={{ fontSize: 11, color: C.muted }}>
                {itens.length === 0 ? 'Vazio' : `${itens.length} item${itens.length !== 1 ? 's' : ''}`}
              </div>
            </div>
            {itens.length > 0 && (
              <button
                onClick={limpar}
                style={{
                  background: 'none', border: `1px solid ${C.border}`,
                  borderRadius: 6, cursor: 'pointer', fontSize: 11,
                  color: C.muted, padding: '4px 8px', transition: 'all .15s',
                }}
              >
                Limpar
              </button>
            )}
          </div>

          <div style={{ padding: '0 18px' }}>
            {/* Itens do carrinho */}
            {itens.length === 0 ? (
              <div style={{
                textAlign: 'center', color: C.muted, padding: '32px 0',
                fontSize: 13, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              }}>
                <TagIcon size={24} color={C.border} />
                <span>Clique em um produto para adicionar</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, padding: '8px 0' }}>
                {itens.map(item => (
                  <div key={item.produto_id} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 0', borderBottom: `1px solid ${C.border}`,
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.nome}
                      </div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                        {fmtBRL(item.preco_unitario)} × {item.quantidade}
                      </div>
                    </div>

                    {/* Controles de quantidade */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <button
                        onClick={() => atualizarQtd(item.produto_id, item.quantidade - 1)}
                        style={{
                          width: 24, height: 24, borderRadius: 6, border: `1px solid ${C.border}`,
                          background: C.s2, cursor: 'pointer', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <Minus size={10} color={C.muted} />
                      </button>
                      <span style={{ width: 26, textAlign: 'center', fontSize: 13, fontWeight: 600, color: C.text }}>
                        {item.quantidade}
                      </span>
                      <button
                        onClick={() => atualizarQtd(item.produto_id, item.quantidade + 1)}
                        disabled={item.quantidade >= item.estoque}
                        style={{
                          width: 24, height: 24, borderRadius: 6, border: `1px solid ${C.border}`,
                          background: C.s2, cursor: item.quantidade >= item.estoque ? 'not-allowed' : 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          opacity: item.quantidade >= item.estoque ? 0.4 : 1,
                        }}
                      >
                        <Plus size={10} color={C.muted} />
                      </button>
                    </div>

                    <span style={{ fontSize: 13, fontWeight: 700, color: C.text, minWidth: 58, textAlign: 'right' }}>
                      {fmtBRL(item.preco_unitario * item.quantidade)}
                    </span>
                    <button onClick={() => removerItem(item.produto_id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 3 }}>
                      <Trash2 size={13} color={C.red} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Formulário */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 14, paddingBottom: 18 }}>
              <div>
                <label style={lbl}>Cliente (opcional)</label>
                <input value={cliente} onChange={e => setCliente(e.target.value)} placeholder="Nome do cliente..." style={inp} />
              </div>
              <div>
                <label style={lbl}>Forma de Pagamento</label>
                <select value={formaPagamento} onChange={e => setFormaPagamento(e.target.value)} style={{ ...inp, appearance: 'none' }}>
                  {FORMAS_PAGAMENTO.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </div>
              {formaPagamento === 'CARTAO_CREDITO' && (
                <div>
                  <label style={lbl}>Parcelas</label>
                  <select value={parcelas} onChange={e => setParcelas(Number(e.target.value))} style={{ ...inp, appearance: 'none' }}>
                    {[1,2,3,4,6,8,10,12].map(n => <option key={n} value={n}>{n === 1 ? 'À vista' : `${n}x`}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label style={lbl}>Desconto (R$)</label>
                <input
                  type="number" min="0" step="0.01"
                  value={desconto} onChange={e => setDesconto(Number(e.target.value))}
                  style={inp} placeholder="0,00"
                />
              </div>

              {/* Totais */}
              <div style={{
                background: C.s2, borderRadius: 10, padding: '12px 14px',
                border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 6,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.muted }}>
                  <span>Subtotal</span>
                  <span>{fmtBRL(totalBruto)}</span>
                </div>
                {desconto > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.red }}>
                    <span>Desconto</span>
                    <span>− {fmtBRL(desconto)}</span>
                  </div>
                )}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 17, fontWeight: 800, color: C.text,
                  paddingTop: 8, borderTop: `1px solid ${C.border}`, marginTop: 2,
                }}>
                  <span>Total</span>
                  <span style={{ color: C.accent }}>{fmtBRL(totalLiquido)}</span>
                </div>
              </div>

              {erro && (
                <div style={{
                  fontSize: 12, color: C.red, lineHeight: 1.5,
                  background: 'rgba(255,91,107,.08)',
                  border: `1px solid rgba(255,91,107,.25)`,
                  borderRadius: 9, padding: '10px 14px',
                }}>
                  {erro}
                </div>
              )}

              <button
                onClick={handleFinalizar}
                disabled={loading || !itens.length}
                style={{
                  padding: '14px', borderRadius: 11, border: 'none',
                  fontWeight: 800, fontSize: 14, letterSpacing: 0.2,
                  background: loading || !itens.length
                    ? C.s3
                    : `linear-gradient(135deg, ${C.accent}, ${C.accentD})`,
                  color: loading || !itens.length ? C.muted : '#051a12',
                  cursor: loading || !itens.length ? 'not-allowed' : 'pointer',
                  transition: 'all .2s', boxShadow: (!loading && itens.length)
                    ? `0 4px 18px ${C.accent}35` : 'none',
                }}
              >
                {loading ? 'Registrando…' : '✓ Finalizar Venda'}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
