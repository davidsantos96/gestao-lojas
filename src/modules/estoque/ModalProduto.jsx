import React, { useState, useRef, useEffect, useContext } from 'react'
import { X, Loader2 } from 'lucide-react'
import { ThemeContext } from '../../contexts/ThemeContext'
import {
  Overlay, ModalWrapper, CloseBtn, ModalBadge, ModalTitle,
  FormStack, FormGrid, FormGridUnequal, FormLabel, FormInputWrapper,
  FormInput, FormSelect, ErrorBox, ActionsWrap, CancelBtn, SubmitBtn,
  MarginCalcBox, MarginColumn, MarginLabel, MarginValue,
  ColorPickerContainer, ColorInputFlex, ColorPreviewAbsolute, ColorChipSelected,
  SuggestionsDropdown, SuggestionItem, UnknownColorText, PaletteWrap, PaletteChip
} from './ModalStyles'

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

function resolverCorPorNome(nome) {
  if (!nome) return null
  const lower = nome.toLowerCase().trim()

  if (PT_PARA_CSS[lower]) return cssParaHex(PT_PARA_CSS[lower])
  const parcial = Object.keys(PT_PARA_CSS).find(k => k.startsWith(lower))
  if (parcial) return cssParaHex(PT_PARA_CSS[parcial])
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
    if (a === 0) return null 
    if (r === 0 && g === 0 && b === 0 && cor !== 'black' && cor !== '#000' && cor !== '#000000') return null
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`
  } catch { return null }
}

const INITIAL = {
  sku: '', nome: '', categoria: '', cor: '',
  preco: '', custo: '', estoque_inicial: '', minimo: '',
}

function CorPicker({ value, onChange, disabled }) {
  const [input,     setInput]     = useState('')
  const [preview,   setPreview]   = useState(null)
  const [sugestoes, setSugestoes] = useState([])
  const debounceRef = useRef()

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
      <FormLabel>Cor</FormLabel>

      <ColorPickerContainer>
        <ColorInputFlex>
          <FormInputWrapper style={{ flex: 1 }}>
            {(hexAtual && !input) && (
              <ColorPreviewAbsolute $hex={hexAtual} />
            )}
            <FormInput
              value={input || (!input && value ? value : input)}
              onChange={e => {
                setInput(e.target.value)
                if (!e.target.value) onChange('')
              }}
              onFocus={() => { if (value) setInput(value) }}
              disabled={disabled}
              placeholder="Ex: azul royal, bordô, coral..."
              $padding={hexAtual && !input ? '10px 12px 10px 32px' : '10px 12px'}
            />
          </FormInputWrapper>

          {(value && !input) && (
            <ColorChipSelected $hex={hexAtual}>
              {hexAtual && <span className="chip-circle" />}
              <span className="chip-text">{value}</span>
              <button type="button" onClick={() => { onChange(''); setInput('') }}>✕</button>
            </ColorChipSelected>
          )}
        </ColorInputFlex>

        {(sugestoes.length > 0 || preview) && (
          <SuggestionsDropdown>
            {sugestoes.map(c => (
              <SuggestionItem key={c.nome} type="button" onClick={() => selPaleta(c)} $hex={c.hex}>
                <span className="sugg-circle" />
                <span className="sugg-text">{c.nome}</span>
              </SuggestionItem>
            ))}

            {preview && (
              <SuggestionItem type="button" onClick={confirmarCustom} $hex={preview.hex} $borderTop={sugestoes.length > 0}>
                <span className="sugg-circle" />
                <span className="sugg-text">Usar "<strong>{preview.nome}</strong>"</span>
                <span className="sugg-hex">{preview.hex}</span>
              </SuggestionItem>
            )}

            {sugestoes.length === 0 && !preview && input && (
              <UnknownColorText>
                Cor não reconhecida — verifique o nome
              </UnknownColorText>
            )}
          </SuggestionsDropdown>
        )}
      </ColorPickerContainer>

      {!input && !value && (
        <PaletteWrap>
          {CORES.map(c => (
            <PaletteChip 
              key={c.nome} 
              type="button" 
              title={c.nome} 
              onClick={() => selPaleta(c)} 
              disabled={disabled}
              $hex={c.hex}
            />
          ))}
        </PaletteWrap>
      )}
    </div>
  )
}

export function ModalProduto({ produto, onClose, onSubmit }) {
  const isEdit = !!produto
  const { theme } = useContext(ThemeContext)
  
  const [form, setForm] = useState(produto ? {
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
    <Overlay>
      <ModalWrapper>
        <CloseBtn onClick={onClose} disabled={loading}>
          <X size={18} />
        </CloseBtn>

        <ModalBadge>Estoque</ModalBadge>
        <ModalTitle>{isEdit ? 'Editar Produto' : 'Novo Produto'}</ModalTitle>

        <FormStack>
          <FormGridUnequal>
            <div>
              <FormLabel>Código</FormLabel>
              <FormInput 
                value={form.sku} 
                onChange={e => set('sku', e.target.value.toUpperCase())} 
                disabled={loading} 
                placeholder="CAM-001" 
              />
            </div>
            <div>
              <FormLabel>Nome do produto</FormLabel>
              <FormInput 
                value={form.nome} 
                onChange={e => set('nome', e.target.value)} 
                disabled={loading} 
                placeholder="Camiseta Básica P" 
              />
            </div>
          </FormGridUnequal>

          <div>
            <FormLabel>Categoria</FormLabel>
            <FormSelect 
              value={form.categoria} 
              onChange={e => set('categoria', e.target.value)} 
              disabled={loading}
            >
              <option value="">Selecione...</option>
              {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
            </FormSelect>
          </div>

          <FormGrid>
            <div>
              <FormLabel>Preço de venda (R$)</FormLabel>
              <FormInput 
                type="number" min="0" step="0.01" 
                value={form.preco} 
                onChange={e => set('preco', e.target.value)} 
                disabled={loading} 
                placeholder="0,00" 
              />
            </div>
            <div>
              <FormLabel>Custo (R$)</FormLabel>
              <FormInput 
                type="number" min="0" step="0.01" 
                value={form.custo} 
                onChange={e => set('custo', e.target.value)} 
                disabled={loading} 
                placeholder="0,00" 
              />
            </div>
          </FormGrid>

          <CorPicker value={form.cor} onChange={v => set('cor', v)} disabled={loading} />

          {form.preco && form.custo && parseFloat(form.preco) > 0 && (
            <MarginCalcBox>
              {(() => {
                const margem = ((parseFloat(form.preco) - parseFloat(form.custo)) / parseFloat(form.preco) * 100).toFixed(1)
                const lucro  = (parseFloat(form.preco) - parseFloat(form.custo)).toFixed(2)
                const color  = margem >= 30 ? theme.colors.accent : margem >= 15 ? theme.colors.yellow : theme.colors.red
                return (
                  <>
                    <MarginColumn>
                      <MarginLabel>Margem</MarginLabel>
                      <MarginValue $color={color}>{margem}%</MarginValue>
                    </MarginColumn>
                    <MarginColumn>
                      <MarginLabel>Lucro unit.</MarginLabel>
                      <MarginValue $color={color}>R$ {lucro}</MarginValue>
                    </MarginColumn>
                  </>
                )
              })()}
            </MarginCalcBox>
          )}

          <FormGrid>
            <div>
              <FormLabel>{isEdit ? 'Estoque atual' : 'Estoque inicial'}</FormLabel>
              <FormInput 
                type="number" min="0" 
                value={form.estoque_inicial} 
                onChange={e => set('estoque_inicial', e.target.value)} 
                disabled={loading || isEdit} 
                placeholder="0" 
              />
              {isEdit && <div style={{ fontSize: 11, color: theme.colors.muted, marginTop: 4 }}>Use "Nova Movimentação" para ajustar.</div>}
            </div>
            <div>
              <FormLabel>Estoque mínimo</FormLabel>
              <FormInput 
                type="number" min="0" 
                value={form.minimo} 
                onChange={e => set('minimo', e.target.value)} 
                disabled={loading} 
                placeholder="5" 
              />
            </div>
          </FormGrid>

          {error && <ErrorBox>{error}</ErrorBox>}

          <ActionsWrap>
            <CancelBtn type="button" onClick={onClose} disabled={loading}>
              Cancelar
            </CancelBtn>
            <SubmitBtn type="button" onClick={handleSubmit} disabled={loading} $loading={loading}>
              {loading
                ? <><Loader2 size={14} /> Salvando...</>
                : isEdit ? 'Salvar alterações' : 'Cadastrar produto'
              }
            </SubmitBtn>
          </ActionsWrap>

        </FormStack>
      </ModalWrapper>
    </Overlay>
  )
}
