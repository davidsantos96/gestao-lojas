import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { C } from '../../constants/theme'

const CATEGORIAS_DESPESA = ['Fornecedor', 'Aluguel', 'Utilities', 'RH', 'Marketing', 'Outro']
const CATEGORIAS_RECEITA = ['Venda Balcão', 'Venda Online', 'Atacado', 'Outro']

const INITIAL = { tipo: 'despesa', descricao: '', valor: '', data: '', categoria: '' }

export function ModalLancamento({ lancamento, onClose, onSubmit }) {
  const isEdit = !!lancamento
  const [form,    setForm]    = useState(() => {
    if (!lancamento) return INITIAL
    
    let formattedDate = ''
    if (lancamento.data) {
      if (lancamento.data.includes('/')) {
        formattedDate = lancamento.data.split('/').reverse().join('-')
      } else {
        try {
          formattedDate = new Date(lancamento.data).toISOString().split('T')[0]
        } catch(e) { /* ignore */ }
      }
    }

    return {
      tipo:      (lancamento.tipo ?? 'DESPESA').toLowerCase(),
      descricao: lancamento.descricao ?? '',
      valor:     lancamento.valor ?? '',
      data:      formattedDate,
      categoria: lancamento.categoria ?? '',
    }
  })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const isReceita  = form.tipo === 'receita'
  const categorias = isReceita ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA

  const hoje = new Date().toISOString().split('T')[0]

  // Ao trocar tipo limpa campos que não se aplicam
  const handleTipo = (tipo) => {
    setForm(f => ({ ...f, tipo, data: tipo === 'receita' ? hoje : '', categoria: '' }))
    setError(null)
  }

  const handleSubmit = async () => {
    if (!form.descricao || !form.valor) {
      setError('Preencha Descrição e Valor.')
      return
    }
    if (!form.data) {
      setError(isReceita ? 'Preencha a data do recebimento.' : 'Preencha a data de vencimento.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const payload = {
        tipo:      form.tipo.toUpperCase(),
        descricao: form.descricao,
        valor:     parseFloat(form.valor),
        data:      form.data,
        categoria_id: form.categoria || undefined,
      }
      await onSubmit?.(payload)
      onClose()
    } catch (err) {
      setError(err?.message || 'Erro ao registrar lançamento.')
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
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32, width: 480, position: 'relative' }}>
        <button onClick={onClose} disabled={loading} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer' }}>
          <X size={18} color={C.muted} />
        </button>

        <div style={{ fontSize: 11, color: C.blue, fontFamily: 'monospace', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Financeiro</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 24 }}>{isEdit ? 'Editar Lançamento' : 'Novo Lançamento'}</h3>

        {/* Tipo toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, padding: 4, background: C.s2, borderRadius: 10, border: `1px solid ${C.border}` }}>
          {['despesa', 'receita'].map(t => (
            <button key={t} onClick={() => handleTipo(t)} style={{
              flex: 1, padding: '8px 0', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: form.tipo === t ? (t === 'receita' ? 'rgba(0,217,168,.15)' : 'rgba(255,91,107,.15)') : 'transparent',
              color: form.tipo === t ? (t === 'receita' ? C.accent : C.red) : C.muted,
              transition: 'all .15s',
            }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Descrição */}
          <div>
            <label style={labelStyle}>Descrição</label>
            <input
              value={form.descricao}
              onChange={e => set('descricao', e.target.value)}
              disabled={loading}
              style={inputStyle}
              placeholder={isReceita ? 'Ex: Venda balcão — Pedido #4821' : 'Ex: Fornecedor Têxtil Alfa'}
            />
          </div>

          {/* Valor + Vencimento (despesa) | só Valor (receita) */}
          <div style={{ display: 'grid', gridTemplateColumns: isReceita ? '1fr' : '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Valor (R$)</label>
              <input
                type="number" min="0" step="0.01"
                value={form.valor}
                onChange={e => set('valor', e.target.value)}
                disabled={loading}
                style={inputStyle}
                placeholder="0,00"
              />
            </div>
            {!isReceita && (
              <div>
                <label style={labelStyle}>Vencimento</label>
                <input
                  type="date"
                  value={form.data}
                  onChange={e => set('data', e.target.value)}
                  disabled={loading}
                  style={{ ...inputStyle, colorScheme: 'dark' }}
                />
              </div>
            )}
          </div>

          {/* Categoria */}
          <div>
            <label style={labelStyle}>Categoria</label>
            <select value={form.categoria} onChange={e => set('categoria', e.target.value)} disabled={loading} style={inputStyle}>
              <option value="">Selecione...</option>
              {categorias.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Data de recebimento para receita */}
          {isReceita && (
            <div>
              <label style={labelStyle}>Data do recebimento</label>
              <input
                type="date"
                value={form.data}
                onChange={e => set('data', e.target.value)}
                disabled={loading}
                style={{ ...inputStyle, colorScheme: 'dark' }}
              />
            </div>
          )}

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
              background: loading ? C.blueD : C.blue,
              color: '#fff', fontWeight: 700, fontSize: 13,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              {loading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> {isEdit ? 'Salvando...' : 'Registrando...'}</> : isEdit ? 'Salvar' : 'Registrar'}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )
}
