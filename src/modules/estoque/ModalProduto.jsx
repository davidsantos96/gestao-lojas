import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { C } from '../../constants/theme'

const CATEGORIAS = ['Vestuário', 'Calçados', 'Acessórios', 'Eletrônicos', 'Alimentação', 'Outro']

const INITIAL = {
  sku: '', nome: '', categoria: '',
  preco: '', custo: '', estoque_inicial: '', minimo: '',
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

export function ModalProduto({ produto, onClose, onSubmit }) {
  const isEdit = !!produto
  const [form,    setForm]    = useState(produto ? {
    sku:              produto.sku,
    nome:             produto.nome,
    categoria:        produto.categoria,
    preco:            produto.preco,
    custo:            produto.custo,
    estoque_inicial:  produto.estoque,
    minimo:           produto.minimo,
  } : INITIAL)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const validate = () => {
    if (!form.sku.trim())   return 'SKU é obrigatório.'
    if (!form.nome.trim())  return 'Nome é obrigatório.'
    if (!form.categoria)    return 'Selecione uma categoria.'
    if (!form.preco)        return 'Preço de venda é obrigatório.'
    if (!form.custo)        return 'Custo é obrigatório.'
    if (!isEdit && !form.estoque_inicial && form.estoque_inicial !== 0) return 'Estoque inicial é obrigatório.'
    if (!form.minimo)       return 'Estoque mínimo é obrigatório.'
    return null
  }

  const handleSubmit = async () => {
    const err = validate()
    if (err) { setError(err); return }
    setLoading(true)
    setError(null)
    try {
      await onSubmit?.({
        ...form,
        preco:            parseFloat(form.preco),
        custo:            parseFloat(form.custo),
        estoque_inicial:  parseInt(form.estoque_inicial, 10),
        minimo:           parseInt(form.minimo, 10),
      })
      onClose()
    } catch (err) {
      setError(err?.message || 'Erro ao salvar produto.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32, width: 540, position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>

        <button onClick={onClose} disabled={loading} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer' }}>
          <X size={18} color={C.muted} />
        </button>

        <div style={{ fontSize: 11, color: C.accent, fontFamily: 'monospace', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Estoque</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 24 }}>
          {isEdit ? 'Editar Produto' : 'Novo Produto'}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* SKU + Nome */}
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>SKU</label>
              <input value={form.sku} onChange={e => set('sku', e.target.value.toUpperCase())} disabled={loading || isEdit} placeholder="CAM-001" style={{ ...inputStyle, opacity: isEdit ? .6 : 1 }} />
            </div>
            <div>
              <label style={labelStyle}>Nome do produto</label>
              <input value={form.nome} onChange={e => set('nome', e.target.value)} disabled={loading} placeholder="Camiseta Básica P" style={inputStyle} />
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label style={labelStyle}>Categoria</label>
            <select value={form.categoria} onChange={e => set('categoria', e.target.value)} disabled={loading} style={inputStyle}>
              <option value="">Selecione...</option>
              {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Preço + Custo */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Preço de venda (R$)</label>
              <input type="number" min="0" step="0.01" value={form.preco} onChange={e => set('preco', e.target.value)} disabled={loading} placeholder="0,00" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Custo (R$)</label>
              <input type="number" min="0" step="0.01" value={form.custo} onChange={e => set('custo', e.target.value)} disabled={loading} placeholder="0,00" style={inputStyle} />
            </div>
          </div>

          {/* Margem calculada ao vivo */}
          {form.preco && form.custo && parseFloat(form.preco) > 0 && (
            <div style={{ padding: '10px 14px', background: C.s2, borderRadius: 8, border: `1px solid ${C.border}`, display: 'flex', gap: 24 }}>
              {(() => {
                const margem = ((parseFloat(form.preco) - parseFloat(form.custo)) / parseFloat(form.preco) * 100).toFixed(1)
                const lucro  = (parseFloat(form.preco) - parseFloat(form.custo)).toFixed(2)
                const color  = margem >= 30 ? C.accent : margem >= 15 ? C.yellow : C.red
                return (
                  <>
                    <div>
                      <div style={{ fontSize: 10, color: C.muted, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: 1 }}>Margem</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color }}>{margem}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: C.muted, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: 1 }}>Lucro unit.</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color }}>R$ {lucro}</div>
                    </div>
                  </>
                )
              })()}
            </div>
          )}

          {/* Estoque inicial + Mínimo */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>{isEdit ? 'Estoque atual' : 'Estoque inicial'}</label>
              <input type="number" min="0" value={form.estoque_inicial} onChange={e => set('estoque_inicial', e.target.value)} disabled={loading || isEdit} placeholder="0" style={{ ...inputStyle, opacity: isEdit ? .6 : 1 }} />
              {isEdit && <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Use "Nova Movimentação" para ajustar.</div>}
            </div>
            <div>
              <label style={labelStyle}>Estoque mínimo</label>
              <input type="number" min="0" value={form.minimo} onChange={e => set('minimo', e.target.value)} disabled={loading} placeholder="5" style={inputStyle} />
            </div>
          </div>

          {/* Erro */}
          {error && (
            <div style={{ fontSize: 12, color: C.red, background: 'rgba(255,91,107,.08)', border: `1px solid rgba(255,91,107,.25)`, borderRadius: 8, padding: '8px 12px' }}>
              {error}
            </div>
          )}

          {/* Ações */}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
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
              {loading
                ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Salvando...</>
                : isEdit ? 'Salvar alterações' : 'Cadastrar produto'
              }
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )
}
