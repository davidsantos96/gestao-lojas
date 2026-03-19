import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { C } from '../../constants/theme'

const INITIAL = { produto_id: '', tipo: 'entrada', qtd: '', obs: '', motivo: '' }

export function ModalMovimentacao({ produtos = [], onClose, onSubmit }) {
  const [form,    setForm]    = useState(INITIAL)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = async () => {
    if (!form.produto_id) { setError('Selecione um produto.'); return }
    if (form.tipo === 'saida' && !form.motivo) { setError('Selecione o motivo da saída.'); return }
    if (!form.qtd || Number(form.qtd) <= 0) { setError('Informe uma quantidade válida.'); return }
    setLoading(true)
    setError(null)
    try {
      await onSubmit?.({ ...form, qtd: Number(form.qtd) })
      onClose()
    } catch (err) {
      setError(err?.message || 'Erro ao registrar movimentação.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px', background: C.s2,
    border: `1px solid ${C.border}`, borderRadius: 8,
    color: C.text, fontSize: 13, outline: 'none',
  }
  const labelStyle = {
    fontSize: 11, color: C.muted, fontFamily: 'monospace',
    letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6,
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32, width: 460, position: 'relative' }}>
        <button onClick={onClose} disabled={loading} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer' }}>
          <X size={18} color={C.muted} />
        </button>

        <div style={{ fontSize: 11, color: C.accent, fontFamily: 'monospace', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Estoque</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 24 }}>Nova Movimentação</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Produto — select dinâmico se lista disponível, input manual caso contrário */}
          <div>
            <label style={labelStyle}>Produto</label>
            {produtos.length > 0 ? (
              <select value={form.produto_id} onChange={e => set('produto_id', e.target.value)} disabled={loading} style={inputStyle}>
                <option value="">Selecione o produto...</option>
                {produtos.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.sku} — {p.nome} {p.cor ? `(${p.cor})` : ''} · {p.estoque} un.
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={form.produto_id}
                onChange={e => set('produto_id', e.target.value)}
                disabled={loading}
                placeholder="ID ou código do produto"
                style={inputStyle}
              />
            )}
          </div>

          {/* Tipo */}
          <div>
            <label style={labelStyle}>Tipo</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { value: 'entrada', label: 'Entrada',  color: C.accent },
                { value: 'saida',   label: 'Saída',    color: C.red    },
                { value: 'ajuste',  label: 'Ajuste',   color: C.yellow },
              ].map(t => (
                <button key={t.value} onClick={() => set('tipo', t.value)} disabled={loading} style={{
                  flex: 1, padding: '9px 0', borderRadius: 8, border: `1.5px solid ${form.tipo === t.value ? t.color : C.border}`,
                  background: form.tipo === t.value ? `${t.color}18` : C.s2,
                  color: form.tipo === t.value ? t.color : C.muted,
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all .12s',
                }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Motivo da Saída */}
          {form.tipo === 'saida' && (
            <div>
              <label style={labelStyle}>Motivo da Saída</label>
              <select value={form.motivo} onChange={e => set('motivo', e.target.value)} disabled={loading} style={inputStyle}>
                <option value="">Selecione...</option>
                <option value="Venda">Venda</option>
                <option value="Descarte">Descarte / Perda</option>
                <option value="Uso Interno">Uso Interno</option>
                <option value="Outro">Outro</option>
              </select>

              {form.motivo === 'Venda' && (
                <div style={{ marginTop: 8, fontSize: 12, color: C.green, background: 'rgba(0,217,168,.1)', padding: '6px 10px', borderRadius: 6, border: `1px solid ${C.green}44` }}>
                  Será registrado automaticamente no <b>Controle de Vendas</b>.
                </div>
              )}
            </div>
          )}

          {/* Quantidade */}
          <div>
            <label style={labelStyle}>Quantidade</label>
            <input type="number" min="1" value={form.qtd} onChange={e => set('qtd', e.target.value)} disabled={loading} placeholder="0" style={inputStyle} />
          </div>

          {/* Observação / Origem */}
          <div>
            <label style={labelStyle}>Origem / Observação</label>
            <input value={form.obs} onChange={e => set('obs', e.target.value)} disabled={loading} placeholder="Ex: Fornecedor A, Venda #4821..." style={inputStyle} />
          </div>

          {error && (
            <div style={{ fontSize: 12, color: C.red, background: 'rgba(255,91,107,.08)', border: `1px solid rgba(255,91,107,.25)`, borderRadius: 8, padding: '8px 12px' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button onClick={onClose} disabled={loading} style={{ flex: 1, padding: 11, borderRadius: 8, border: `1px solid ${C.border}`, background: 'none', color: C.muted, fontSize: 13, cursor: 'pointer' }}>
              Cancelar
            </button>
            <button onClick={handleSubmit} disabled={loading} style={{
              flex: 1, padding: 11, borderRadius: 8, border: 'none',
              background: loading ? C.accentD : C.accent,
              color: '#0b1a14', fontWeight: 700, fontSize: 13,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              {loading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Registrando...</> : 'Registrar'}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )
}
