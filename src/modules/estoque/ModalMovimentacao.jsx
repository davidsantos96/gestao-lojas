import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { C } from '../../constants/theme'

const FIELD_CONFIG = [
  { label: 'Produto',    field: 'produto', type: 'text'   },
  { label: 'Tipo',       field: 'tipo',    type: 'select' },
  { label: 'Quantidade', field: 'qtd',     type: 'number' },
  { label: 'Observação', field: 'obs',     type: 'text'   },
]

const INITIAL_FORM = { produto: '', tipo: 'entrada', qtd: '', obs: '' }

export function ModalMovimentacao({ onClose, onSubmit }) {
  const [form,    setForm]    = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const handleSubmit = async () => {
    if (!form.produto || !form.qtd) {
      setError('Preencha Produto e Quantidade.')
      return
    }
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

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    }}>
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 16, padding: 32, width: 460, position: 'relative',
      }}>
        <button onClick={onClose} disabled={loading} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer' }}>
          <X size={18} color={C.muted} />
        </button>

        <div style={{ fontSize: 11, color: C.accent, fontFamily: 'monospace', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>
          Estoque
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 24 }}>Nova Movimentação</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {FIELD_CONFIG.map(({ label, field, type }) => (
            <div key={field}>
              <label style={{ fontSize: 11, color: C.muted, fontFamily: 'monospace', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                {label}
              </label>
              {type === 'select' ? (
                <select
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  disabled={loading}
                  style={{ width: '100%', padding: '10px 12px', background: C.s2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, outline: 'none' }}
                >
                  <option value="entrada">Entrada</option>
                  <option value="saida">Saída</option>
                  <option value="ajuste">Ajuste</option>
                </select>
              ) : (
                <input
                  type={type}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  disabled={loading}
                  style={{ width: '100%', padding: '10px 12px', background: C.s2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, outline: 'none' }}
                />
              )}
            </div>
          ))}

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
              color: '#0b1a14', fontWeight: 700, fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer',
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
