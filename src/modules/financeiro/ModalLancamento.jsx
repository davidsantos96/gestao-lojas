import { useState, useEffect, useRef } from 'react'
import { X, Loader2, Package, ChevronDown, Search } from 'lucide-react'
import {
  Overlay, ModalContainer, CloseBtn, ModalModule, ModalTitle, FormWrap, TypeToggleWrap, TypeToggleBtn,
  FieldWrap, Grid2, Label, Input, Select, Textarea, ErrorBox, ActionsWrap, CancelBtn, SubmitBtn
} from './ModaisFinanceiroStyles'
import { getProdutos } from '../../services/estoqueService'
import styled from 'styled-components'

// ── Produto picker styles ─────────────────────────────────────────────────────

const SectionToggle = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: ${p => p.$active ? 'rgba(79,143,255,.08)' : p.theme.colors.s2};
  border: 1px solid ${p => p.$active ? p.theme.colors.blue : p.theme.colors.border};
  border-radius: 8px;
  color: ${p => p.$active ? p.theme.colors.blue : p.theme.colors.muted2};
  font-size: 12px;
  font-weight: 600;
  font-family: monospace;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all .15s;

  svg { flex-shrink: 0; }
`

const ProdutoPickerWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background: ${p => p.theme.colors.s2};
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 8px;
`

const SearchInputWrap = styled.div`
  position: relative;

  input { padding-left: 32px; }
  svg {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: ${p => p.theme.colors.muted};
    pointer-events: none;
  }
`

const ProdutoList = styled.div`
  max-height: 160px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const ProdutoItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid ${p => p.$selected ? p.theme.colors.blue : 'transparent'};
  background: ${p => p.$selected ? 'rgba(79,143,255,.1)' : p.theme.colors.s2};
  cursor: ${p => p.$zerado ? 'not-allowed' : 'pointer'};
  opacity: ${p => p.$zerado ? 0.45 : 1};
  text-align: left;
  transition: all .1s;

  &:hover:not(:disabled) {
    border-color: ${p => p.theme.colors.blue};
    background: rgba(79,143,255,.06);
  }
`

const ProdutoNome = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${p => p.theme.colors.text};
  display: block;
`

const ProdutoMeta = styled.span`
  font-size: 11px;
  color: ${p => p.theme.colors.muted};
`

const ProdutoEstoque = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${p => p.$low ? p.theme.colors.yellow ?? '#f5a623' : p.$zerado ? p.theme.colors.red : p.theme.colors.accent};
  white-space: nowrap;
`

const ProdutoSelecionadoCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(79,143,255,.06);
  border: 1px solid ${p => p.theme.colors.blue};
  border-radius: 8px;

  svg { color: ${p => p.theme.colors.blue}; flex-shrink: 0; }
`

const ProdutoCardInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const ProdutoCardNome = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${p => p.theme.colors.text};
`

const ProdutoCardMeta = styled.div`
  font-size: 11px;
  color: ${p => p.theme.colors.muted};
  margin-top: 1px;
`

const ClearBtn = styled.button`
  font-size: 11px;
  color: ${p => p.theme.colors.muted};
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  &:hover { color: ${p => p.theme.colors.red}; }
`

// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIAS_DESPESA = ['Fornecedor', 'Aluguel', 'Utilities', 'RH', 'Marketing', 'Outro']
const CATEGORIAS_RECEITA = ['Venda Balcão', 'Venda Online', 'Atacado', 'Outro']

const INITIAL = {
  tipo: 'despesa', descricao: '', valor: '', data: '', categoria: '',
  num_documento: '', parcelas: 1, observacao: '',
  produto_id: null, quantidade: 1,
}

export function ModalLancamento({ lancamento, onClose, onSubmit }) {
  const isEdit = !!lancamento
  const [form, setForm] = useState(() => {
    if (!lancamento) return INITIAL

    let formattedDate = ''
    if (lancamento.data) {
      if (lancamento.data.includes('/')) {
        formattedDate = lancamento.data.split('/').reverse().join('-')
      } else {
        try { formattedDate = new Date(lancamento.data).toISOString().split('T')[0] } catch (_) {}
      }
    }

    return {
      tipo:          (lancamento.tipo ?? 'DESPESA').toLowerCase(),
      descricao:     lancamento.descricao ?? '',
      valor:         lancamento.valor ?? '',
      data:          formattedDate,
      categoria:     lancamento.categoria ?? '',
      num_documento: lancamento.num_documento ?? '',
      parcelas:      lancamento.parcelas ?? 1,
      observacao:    lancamento.observacao ?? '',
      produto_id:    lancamento.produto_id ?? null,
      quantidade:    lancamento.quantidade ?? 1,
    }
  })

  const [loading,        setLoading]        = useState(false)
  const [error,          setError]          = useState(null)
  const [vinculaProduto, setVinculaProduto] = useState(!!lancamento?.produto_id)
  const [produtos,       setProdutos]       = useState([])
  const [loadingProd,    setLoadingProd]    = useState(false)
  const [buscaProd,      setBuscaProd]      = useState('')
  const buscaRef = useRef(null)

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const isReceita  = form.tipo === 'receita'
  const categorias = isReceita ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA

  const hoje = new Date().toISOString().split('T')[0]

  // Carrega produtos ao abrir o picker
  useEffect(() => {
    if (!vinculaProduto || produtos.length > 0) return
    setLoadingProd(true)
    getProdutos({ limit: 200 })
      .then(res => setProdutos(res?.data ?? res ?? []))
      .catch(() => setProdutos([]))
      .finally(() => setLoadingProd(false))
  }, [vinculaProduto])

  // Foca no campo de busca ao abrir picker
  useEffect(() => {
    if (vinculaProduto && !form.produto_id) {
      setTimeout(() => buscaRef.current?.focus(), 50)
    }
  }, [vinculaProduto])

  const produtosFiltrados = produtos.filter(p => {
    if (!buscaProd) return true
    const q = buscaProd.toLowerCase()
    return p.nome?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q)
  })

  const produtoSelecionado = form.produto_id
    ? produtos.find(p => p.id === form.produto_id)
    : null

  const handleTipo = (tipo) => {
    setForm(f => ({
      ...f, tipo,
      data: tipo === 'receita' ? hoje : '',
      categoria: '', num_documento: '', parcelas: 1, observacao: '',
    }))
    if (tipo === 'despesa') {
      setVinculaProduto(false)
      set('produto_id', null)
    }
    setError(null)
  }

  const handleTogglePicker = () => {
    if (vinculaProduto) {
      setVinculaProduto(false)
      setForm(f => ({ ...f, produto_id: null, quantidade: 1 }))
      setBuscaProd('')
    } else {
      setVinculaProduto(true)
    }
  }

  const handleSelecionarProduto = (p) => {
    if (p.estoque <= 0) return
    setForm(f => ({
      ...f,
      produto_id: p.id,
      quantidade: 1,
      valor: f.valor || String(Number(p.preco).toFixed(2)),
      descricao: f.descricao || p.nome,
    }))
    setBuscaProd('')
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
    if (vinculaProduto && !form.produto_id) {
      setError('Selecione um produto ou desative o vínculo com estoque.')
      return
    }
    if (vinculaProduto && form.produto_id) {
      const prod = produtos.find(p => p.id === form.produto_id)
      if (prod && parseInt(form.quantidade, 10) > prod.estoque) {
        setError(`Estoque insuficiente para "${prod.nome}". Disponível: ${prod.estoque}.`)
        return
      }
    }

    setLoading(true)
    setError(null)
    try {
      const payload = {
        tipo:         form.tipo.toUpperCase(),
        descricao:    form.descricao,
        valor:        parseFloat(form.valor),
        data:         form.data,
        categoria_id: form.categoria || undefined,
        ...(form.tipo === 'despesa' && {
          num_documento: form.num_documento || undefined,
          parcelas:      parseInt(form.parcelas, 10) || 1,
          observacao:    form.observacao || undefined,
        }),
        ...(vinculaProduto && form.produto_id && {
          produto_id: form.produto_id,
          quantidade: parseInt(form.quantidade, 10) || 1,
        }),
      }
      await onSubmit?.(payload)
      onClose()
    } catch (err) {
      setError(err?.message || 'Erro ao registrar lançamento.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Overlay>
      <ModalContainer>
        <CloseBtn onClick={onClose} disabled={loading}>
          <X size={18} />
        </CloseBtn>

        <ModalModule>Financeiro</ModalModule>
        <ModalTitle>{isEdit ? 'Editar Lançamento' : 'Novo Lançamento'}</ModalTitle>

        {/* Tipo toggle */}
        <TypeToggleWrap>
          {['despesa', 'receita'].map(t => (
            <TypeToggleBtn
              key={t}
              onClick={() => handleTipo(t)}
              $active={form.tipo === t}
              $isReceita={t === 'receita'}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </TypeToggleBtn>
          ))}
        </TypeToggleWrap>

        <FormWrap>
          {/* Descrição */}
          <FieldWrap>
            <Label>Descrição</Label>
            <Input
              value={form.descricao}
              onChange={e => set('descricao', e.target.value)}
              disabled={loading}
              placeholder={isReceita ? 'Ex: Venda balcão — Pedido #4821' : 'Ex: Fornecedor Têxtil Alfa'}
            />
          </FieldWrap>

          {/* Valor + Vencimento */}
          <Grid2 $single={isReceita}>
            <FieldWrap>
              <Label>Valor (R$)</Label>
              <Input
                type="number" min="0" step="0.01"
                value={form.valor}
                onChange={e => set('valor', e.target.value)}
                disabled={loading}
                placeholder="0,00"
              />
            </FieldWrap>
            {!isReceita && (
              <FieldWrap>
                <Label>Vencimento</Label>
                <Input
                  type="date"
                  value={form.data}
                  onChange={e => set('data', e.target.value)}
                  disabled={loading}
                />
              </FieldWrap>
            )}
          </Grid2>

          {/* Categoria */}
          <FieldWrap>
            <Label>Categoria</Label>
            <Select value={form.categoria} onChange={e => set('categoria', e.target.value)} disabled={loading}>
              <option value="">Selecione...</option>
              {categorias.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </FieldWrap>

          {/* Campos exclusivos de despesa */}
          {!isReceita && (
            <>
              <Grid2>
                <FieldWrap>
                  <Label>Nº Documento</Label>
                  <Input
                    value={form.num_documento}
                    onChange={e => set('num_documento', e.target.value)}
                    disabled={loading}
                    placeholder="Ex: NF-0042, Bol-123"
                  />
                </FieldWrap>
                <FieldWrap>
                  <Label>Parcelas</Label>
                  <Input
                    type="number" min="1" max="60" step="1"
                    value={form.parcelas}
                    onChange={e => set('parcelas', e.target.value)}
                    disabled={loading}
                  />
                </FieldWrap>
              </Grid2>
              <FieldWrap>
                <Label>Observação</Label>
                <Textarea
                  value={form.observacao}
                  onChange={e => set('observacao', e.target.value)}
                  disabled={loading}
                  placeholder="Informações adicionais sobre este lançamento..."
                />
              </FieldWrap>
            </>
          )}

          {/* Data de recebimento para receita */}
          {isReceita && (
            <FieldWrap>
              <Label>Data do recebimento</Label>
              <Input
                type="date"
                value={form.data}
                onChange={e => set('data', e.target.value)}
                disabled={loading}
              />
            </FieldWrap>
          )}

          {/* ── Vínculo com produto do estoque (só receita) ──────────────── */}
          {isReceita && (
            <>
              <SectionToggle
                type="button"
                $active={vinculaProduto}
                onClick={handleTogglePicker}
                disabled={loading}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Package size={13} />
                  Vincular produto do estoque
                </span>
                <ChevronDown
                  size={14}
                  style={{ transform: vinculaProduto ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}
                />
              </SectionToggle>

              {vinculaProduto && (
                <ProdutoPickerWrap>
                  {/* Produto já selecionado */}
                  {produtoSelecionado ? (
                    <>
                      <ProdutoSelecionadoCard>
                        <Package size={16} />
                        <ProdutoCardInfo>
                          <ProdutoCardNome>{produtoSelecionado.nome}</ProdutoCardNome>
                          <ProdutoCardMeta>
                            SKU: {produtoSelecionado.sku} · Estoque: {produtoSelecionado.estoque} un ·
                            R$ {Number(produtoSelecionado.preco).toFixed(2)}
                          </ProdutoCardMeta>
                        </ProdutoCardInfo>
                        <ClearBtn type="button" onClick={() => setForm(f => ({ ...f, produto_id: null, quantidade: 1 }))}>
                          Trocar
                        </ClearBtn>
                      </ProdutoSelecionadoCard>

                      <FieldWrap>
                        <Label>Quantidade</Label>
                        <Input
                          type="number" min="1" max={produtoSelecionado.estoque} step="1"
                          value={form.quantidade}
                          onChange={e => set('quantidade', e.target.value)}
                          disabled={loading}
                        />
                      </FieldWrap>
                    </>
                  ) : (
                    /* Busca de produto */
                    <>
                      <SearchInputWrap>
                        <Search size={13} />
                        <Input
                          ref={buscaRef}
                          value={buscaProd}
                          onChange={e => setBuscaProd(e.target.value)}
                          placeholder="Buscar por nome ou SKU..."
                          disabled={loadingProd || loading}
                        />
                      </SearchInputWrap>

                      {loadingProd ? (
                        <div style={{ textAlign: 'center', padding: '12px 0', fontSize: 12, color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Carregando produtos...
                        </div>
                      ) : (
                        <ProdutoList>
                          {produtosFiltrados.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '10px 0', fontSize: 12, color: '#888' }}>
                              {buscaProd ? 'Nenhum produto encontrado.' : 'Nenhum produto disponível.'}
                            </div>
                          )}
                          {produtosFiltrados.map(p => (
                            <ProdutoItem
                              key={p.id}
                              type="button"
                              $zerado={p.estoque <= 0}
                              disabled={p.estoque <= 0}
                              onClick={() => handleSelecionarProduto(p)}
                            >
                              <div>
                                <ProdutoNome>{p.nome}</ProdutoNome>
                                <ProdutoMeta>{p.sku}{p.cor ? ` · ${p.cor}` : ''} · R$ {Number(p.preco).toFixed(2)}</ProdutoMeta>
                              </div>
                              <ProdutoEstoque $low={p.estoque > 0 && p.estoque <= p.minimo} $zerado={p.estoque <= 0}>
                                {p.estoque <= 0 ? 'Zerado' : `${p.estoque} un`}
                              </ProdutoEstoque>
                            </ProdutoItem>
                          ))}
                        </ProdutoList>
                      )}
                    </>
                  )}
                </ProdutoPickerWrap>
              )}
            </>
          )}

          {error && <ErrorBox>{error}</ErrorBox>}

          <ActionsWrap>
            <CancelBtn onClick={onClose} disabled={loading}>
              Cancelar
            </CancelBtn>
            <SubmitBtn onClick={handleSubmit} disabled={loading} $loading={loading}>
              {loading
                ? <><Loader2 size={14} /> {isEdit ? 'Salvando...' : 'Registrando...'}</>
                : isEdit ? 'Salvar' : 'Registrar'}
            </SubmitBtn>
          </ActionsWrap>
        </FormWrap>
      </ModalContainer>
    </Overlay>
  )
}


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
      tipo:          (lancamento.tipo ?? 'DESPESA').toLowerCase(),
      descricao:     lancamento.descricao ?? '',
      valor:         lancamento.valor ?? '',
      data:          formattedDate,
      categoria:     lancamento.categoria ?? '',
      num_documento: lancamento.num_documento ?? '',
      parcelas:      lancamento.parcelas ?? 1,
      observacao:    lancamento.observacao ?? '',
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
    setForm(f => ({ ...f, tipo, data: tipo === 'receita' ? hoje : '', categoria: '', num_documento: '', parcelas: 1, observacao: '' }))
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
        tipo:          form.tipo.toUpperCase(),
        descricao:     form.descricao,
        valor:         parseFloat(form.valor),
        data:          form.data,
        categoria_id:  form.categoria || undefined,
        ...(form.tipo === 'despesa' && {
          num_documento: form.num_documento || undefined,
          parcelas:      parseInt(form.parcelas, 10) || 1,
          observacao:    form.observacao || undefined,
        }),
      }
      await onSubmit?.(payload)
      onClose()
    } catch (err) {
      setError(err?.message || 'Erro ao registrar lançamento.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Overlay>
      <ModalContainer>
        <CloseBtn onClick={onClose} disabled={loading}>
          <X size={18} />
        </CloseBtn>

        <ModalModule>Financeiro</ModalModule>
        <ModalTitle>{isEdit ? 'Editar Lançamento' : 'Novo Lançamento'}</ModalTitle>

        {/* Tipo toggle */}
        <TypeToggleWrap>
          {['despesa', 'receita'].map(t => (
            <TypeToggleBtn 
              key={t} 
              onClick={() => handleTipo(t)}
              $active={form.tipo === t}
              $isReceita={t === 'receita'}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </TypeToggleBtn>
          ))}
        </TypeToggleWrap>

        <FormWrap>
          {/* Descrição */}
          <FieldWrap>
            <Label>Descrição</Label>
            <Input
              value={form.descricao}
              onChange={e => set('descricao', e.target.value)}
              disabled={loading}
              placeholder={isReceita ? 'Ex: Venda balcão — Pedido #4821' : 'Ex: Fornecedor Têxtil Alfa'}
            />
          </FieldWrap>

          {/* Valor + Vencimento (despesa) | só Valor (receita) */}
          <Grid2 $single={isReceita}>
            <FieldWrap>
              <Label>Valor (R$)</Label>
              <Input
                type="number" min="0" step="0.01"
                value={form.valor}
                onChange={e => set('valor', e.target.value)}
                disabled={loading}
                placeholder="0,00"
              />
            </FieldWrap>
            {!isReceita && (
              <FieldWrap>
                <Label>Vencimento</Label>
                <Input
                  type="date"
                  value={form.data}
                  onChange={e => set('data', e.target.value)}
                  disabled={loading}
                />
              </FieldWrap>
            )}
          </Grid2>

          {/* Categoria */}
          <FieldWrap>
            <Label>Categoria</Label>
            <Select value={form.categoria} onChange={e => set('categoria', e.target.value)} disabled={loading}>
              <option value="">Selecione...</option>
              {categorias.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </FieldWrap>

          {/* Campos exclusivos de despesa */}
          {!isReceita && (
            <>
              <Grid2>
                <FieldWrap>
                  <Label>Nº Documento</Label>
                  <Input
                    value={form.num_documento}
                    onChange={e => set('num_documento', e.target.value)}
                    disabled={loading}
                    placeholder="Ex: NF-0042, Bol-123"
                  />
                </FieldWrap>
                <FieldWrap>
                  <Label>Parcelas</Label>
                  <Input
                    type="number" min="1" max="60" step="1"
                    value={form.parcelas}
                    onChange={e => set('parcelas', e.target.value)}
                    disabled={loading}
                  />
                </FieldWrap>
              </Grid2>
              <FieldWrap>
                <Label>Observação</Label>
                <Textarea
                  value={form.observacao}
                  onChange={e => set('observacao', e.target.value)}
                  disabled={loading}
                  placeholder="Informações adicionais sobre este lançamento..."
                />
              </FieldWrap>
            </>
          )}

          {/* Data de recebimento para receita */}
          {isReceita && (
            <FieldWrap>
              <Label>Data do recebimento</Label>
              <Input
                type="date"
                value={form.data}
                onChange={e => set('data', e.target.value)}
                disabled={loading}
              />
            </FieldWrap>
          )}

          {error && <ErrorBox>{error}</ErrorBox>}

          <ActionsWrap>
            <CancelBtn onClick={onClose} disabled={loading}>
              Cancelar
            </CancelBtn>
            <SubmitBtn onClick={handleSubmit} disabled={loading} $loading={loading}>
              {loading ? <><Loader2 size={14} /> {isEdit ? 'Salvando...' : 'Registrando...'}</> : isEdit ? 'Salvar' : 'Registrar'}
            </SubmitBtn>
          </ActionsWrap>
        </FormWrap>
      </ModalContainer>
    </Overlay>
  )
}

