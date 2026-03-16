import { useState, useRef, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import { C } from '../../constants/theme'

const CATEGORIAS = ['Vestuário', 'Calçados', 'Acessórios']

const CORES = [
  { nome: 'Preto',      hex: '#1a1a1a' },
  { nome: 'Branco',     hex: '#f5f5f5' },
  { nome: 'Cinza',      hex: '#9e9e9e' },
  { nome: 'Azul',       hex: '#1565c0' },
  { nome: 'Azul Claro', hex: '#64b5f6' },
  { nome: 'Vermelho',   hex: '#c62828' },
  { nome: 'Rosa',       hex: '#e91e63' },
  { nome: 'Verde',      hex: '#2e7d32' },
  { nome: 'Amarelo',    hex: '#f9a825' },
  { nome: 'Laranja',    hex: '#e65100' },
  { nome: 'Roxo',       hex: '#6a1b9a' },
  { nome: 'Marrom',     hex: '#4e342e' },
  { nome: 'Bege',       hex: '#d7ccc8' },
  { nome: 'Vinho',      hex: '#880e4f' },
]

// Mapa PT-BR → CSS color names para reconhecimento automático
const PT_PARA_CSS = {
  'preto':'black','negro':'black','escuro':'#222',
  'branco':'white','claro':'#f8f8f8',
  'cinza':'gray','cinzento':'gray','prata':'silver',
  'vermelho':'red','encarnado':'red',
  'azul':'blue','azul marinho':'navy','marinho':'navy',
  'azul claro':'#64b5f6','azul bebê':'lightblue','celeste':'#87ceeb',
  'azul royal':'royalblue','royal':'royalblue',
  'verde':'green','verde escuro':'darkgreen','verde claro':'lightgreen',
  'verde oliva':'olive','oliva':'olive','musgo':'#4a5240',
  'amarelo':'yellow','dourado':'gold','ouro':'gold',
  'laranja':'orange','coral':'coral','salmão':'salmon','salmon':'salmon',
  'rosa':'#e91e63','rosa claro':'pink','pink':'pink','fúcsia':'fuchsia',
  'roxo':'purple','violeta':'violet','lilás':'#c8a2c8','lavanda':'lavender',
  'marrom':'#4e342e','café':'#4e342e','chocolate':'chocolate','caramelo':'#c68642',
  'bege':'#d7ccc8','areia':'#c2b280','nude':'#e8c9a0',
  'vinho':'#880e4f','bordô':'#800000','borgonha':'#800020',
  'terracota':'#c0652b','cobre':'#b87333',
  'creme':'#fffdd0','off-white':'#f8f4e3','offwhite':'#f8f4e3',
  'turquesa':'turquoise','água':'#00ced1','tiffany':'#81d8d0',
  'índigo':'indigo','anil':'#4b0082',
}

// Tenta resolver nome digitado → hex usando canvas
function resolverCorPorNome(nome) {
  if (!nome) return null
  const lower = nome.toLowerCase().trim()

  // 1. Busca no mapa PT
  if (PT_PARA_CSS[lower]) {
    return cssParaHex(PT_PARA_CSS[lower])
  }

  // 2. Tentativa parcial no mapa PT (ex: "azul ma" → "azul marinho")
  const parcial = Object.keys(PT_PARA_CSS).find(k => k.startsWith(lower))
  if (parcial) return cssParaHex(PT_PARA_CSS[parcial])

  // 3. Tenta direto como CSS color name (inglês e hex)
  return cssParaHex(lower)
}

function cssParaHex(cor) {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 1
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = cor
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
    if (a === 0) return null  // transparente = nome inválido
    // ignora preto puro (fillStyle inválido retorna preto)
    if (r === 0 && g === 0 && b === 0 && cor !== 'black' && cor !== '#000' && cor !== '#000000') return null
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`
  } catch { return null }
}

const INITIAL = {
  sku: '', nome: '', categoria: '', cor: '',
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

// ─── Seletor de cor ──────────────────────────────────────────────────────────
function CorPicker({ value, onChange, disabled, labelStyle }) {
  const [input,     setInput]     = useState('')
  const [preview,   setPreview]   = useState(null)   // { hex, nome } da cor digitada
  const [sugestoes, setSugestoes] = useState([])
  const debounceRef = useRef()

  // Filtra sugestões da paleta conforme digitação
  useEffect(() => {
    clearTimeout(debounceRef.current)
    if (!input.trim()) { setSugestoes([]); setPreview(null); return }
    debounceRef.current = setTimeout(() => {
      const q = input.toLowerCase()
      const found = CORES.filter(c => c.nome.toLowerCase().includes(q))
      setSugestoes(found)
      if (found.length === 0) {
        const hex = resolverCorPorNome(q)
        setPreview(hex ? { hex, nome: input.trim() } : null)
      } else {
        setPreview(null)
      }
    }, 200)
  }, [input])

  const selPaleta = (c) => {
    onChange(c.nome)
    setInput('')
    setSugestoes([])
    setPreview(null)
  }

  const confirmarCustom = () => {
    if (!preview) return
    onChange(preview.nome)
    setInput('')
    setPreview(null)
    setSugestoes([])
  }

  const hexAtual = CORES.find(c => c.nome === value)?.hex
    || (value ? resolverCorPorNome(value) : null)

  return (
    <div>
      <label style={labelStyle}>Cor</label>

      {/* Campo de busca / digitação */}
      <div style={{ position: 'relative', marginBottom: 10 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            {/* Preview ao lado esquerdo do input */}
            {(hexAtual && !input) && (
              <span style={{
                position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                width: 14, height: 14, borderRadius: '50%', background: hexAtual,
                border: hexAtual === '#f5f5f5' ? `1px solid #555` : 'none',
                flexShrink: 0,
              }} />
            )}
            <input
              value={input || (!input && value ? value : input)}
              onChange={e => {
                setInput(e.target.value)
                if (!e.target.value) onChange('')
              }}
              onFocus={() => { if (value) setInput(value) }}
              disabled={disabled}
              placeholder="Ex: azul royal, bordô, coral..."
              style={{
                width: '100%',
                padding: hexAtual && !input ? '10px 12px 10px 32px' : '10px 12px',
                background: C.s2, border: `1px solid ${C.border}`,
                borderRadius: 8, color: C.text, fontSize: 13, outline: 'none',
              }}
            />
          </div>

          {/* Chip da cor selecionada ou preview */}
          {(value && !input) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 20, background: hexAtual ? `${hexAtual}22` : C.s2, border: `1.5px solid ${hexAtual || C.border}`, whiteSpace: 'nowrap' }}>
              {hexAtual && <span style={{ width: 10, height: 10, borderRadius: '50%', background: hexAtual, flexShrink: 0 }} />}
              <span style={{ fontSize: 12, fontWeight: 600, color: hexAtual || C.muted2 }}>{value}</span>
              <button onClick={() => { onChange(''); setInput('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 13, lineHeight: 1, padding: 0, marginLeft: 2 }}>✕</button>
            </div>
          )}
        </div>

        {/* Dropdown de sugestões */}
        {(sugestoes.length > 0 || preview) && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, marginTop: 4, zIndex: 50, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,.4)' }}>
            {sugestoes.map(c => (
              <button key={c.nome} onClick={() => selPaleta(c)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                onMouseEnter={e => e.currentTarget.style.background = C.s2}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                <span style={{ width: 14, height: 14, borderRadius: '50%', background: c.hex, flexShrink: 0, border: c.hex === '#f5f5f5' ? `1px solid ${C.border}` : 'none' }} />
                <span style={{ fontSize: 13, color: C.text }}>{c.nome}</span>
              </button>
            ))}

            {preview && (
              <button onClick={confirmarCustom} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', background: 'none', border: 'none', borderTop: `1px solid ${C.border}`, cursor: 'pointer', textAlign: 'left' }}
                onMouseEnter={e => e.currentTarget.style.background = C.s2}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                <span style={{ width: 14, height: 14, borderRadius: '50%', background: preview.hex, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: C.text }}>Usar "<strong>{preview.nome}</strong>"</span>
                <span style={{ fontSize: 11, color: C.muted, marginLeft: 'auto' }}>{preview.hex}</span>
              </button>
            )}

            {sugestoes.length === 0 && !preview && input && (
              <div style={{ padding: '10px 14px', fontSize: 12, color: C.muted }}>
                Cor não reconhecida — verifique o nome
              </div>
            )}
          </div>
        )}
      </div>

      {/* Paleta rápida (chips) */}
      {!input && !value && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {CORES.map(c => (
            <button key={c.nome} type="button" title={c.nome} onClick={() => selPaleta(c)} disabled={disabled}
              style={{ width: 24, height: 24, borderRadius: '50%', background: c.hex, border: `2px solid ${C.border}`, cursor: 'pointer', transition: 'transform .1s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.25)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
          ))}
        </div>
      )}
    </div>
  )
}


export function ModalProduto({ produto, onClose, onSubmit }) {
  const isEdit = !!produto
  const [form,    setForm]    = useState(produto ? {
    sku:              produto.sku,
    nome:             produto.nome,
    categoria:        produto.categoria,
    cor:              produto.cor || '',
    preco:            produto.preco,
    custo:            produto.custo,
    estoque_inicial:  produto.estoque,
    minimo:           produto.minimo,
  } : INITIAL)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const validate = () => {
    if (!form.sku.trim())   return 'Código é obrigatório.'
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

          {/* Código + Nome */}
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Código</label>
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

          {/* Cor */}
          <CorPicker value={form.cor} onChange={v => set('cor', v)} disabled={loading} labelStyle={labelStyle} />

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
