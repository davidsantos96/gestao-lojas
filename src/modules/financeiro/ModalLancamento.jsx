import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import {
  Overlay, ModalContainer, CloseBtn, ModalModule, ModalTitle, FormWrap, TypeToggleWrap, TypeToggleBtn,
  FieldWrap, Grid2, Label, Input, Select, Textarea, ErrorBox, ActionsWrap, CancelBtn, SubmitBtn
} from './ModaisFinanceiroStyles'

const CATEGORIAS_DESPESA = ['Fornecedor', 'Aluguel', 'Utilities', 'RH', 'Marketing', 'Outro']
const CATEGORIAS_RECEITA = ['Venda Balcão', 'Venda Online', 'Atacado', 'Outro']

const INITIAL = { tipo: 'despesa', descricao: '', valor: '', data: '', categoria: '', num_documento: '', parcelas: 1, observacao: '' }

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

