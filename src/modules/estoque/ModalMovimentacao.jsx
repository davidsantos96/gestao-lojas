import React, { useState, useContext } from 'react'
import { X, Loader2 } from 'lucide-react'
import { ThemeContext } from '../../contexts/ThemeContext'
import {
  Overlay, ModalWrapper, CloseBtn, ModalBadge, ModalTitle,
  FormStack, FormLabel, FormInput, FormSelect, ErrorBox, ActionsWrap,
  CancelBtn, SubmitBtn, TypeBtnWrap, TypeBtn, NoticeBox
} from './ModalStyles'

const INITIAL = { produto_id: '', tipo: 'entrada', qtd: '', obs: '', motivo: '' }

export function ModalMovimentacao({ produtos = [], onClose, onSubmit }) {
  const { theme } = useContext(ThemeContext)
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

  const TIPOS = [
    { value: 'entrada', label: 'Entrada',  color: theme.colors.accent },
    { value: 'saida',   label: 'Saída',    color: theme.colors.red    },
    { value: 'ajuste',  label: 'Ajuste',   color: theme.colors.yellow },
  ]

  return (
    <Overlay>
      <ModalWrapper $width="460px">
        <CloseBtn onClick={onClose} disabled={loading}>
          <X size={18} />
        </CloseBtn>

        <ModalBadge>Estoque</ModalBadge>
        <ModalTitle>Nova Movimentação</ModalTitle>

        <FormStack>
          <div>
            <FormLabel>Produto</FormLabel>
            {produtos.length > 0 ? (
              <FormSelect value={form.produto_id} onChange={e => set('produto_id', e.target.value)} disabled={loading}>
                <option value="">Selecione o produto...</option>
                {produtos.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.sku} — {p.nome} {p.cor ? `(${p.cor})` : ''} · {p.estoque} un.
                  </option>
                ))}
              </FormSelect>
            ) : (
              <FormInput
                value={form.produto_id}
                onChange={e => set('produto_id', e.target.value)}
                disabled={loading}
                placeholder="ID ou código do produto"
              />
            )}
          </div>

          <div>
            <FormLabel>Tipo</FormLabel>
            <TypeBtnWrap>
              {TIPOS.map(t => (
                <TypeBtn 
                  key={t.value} 
                  type="button"
                  onClick={() => set('tipo', t.value)} 
                  disabled={loading}
                  $active={form.tipo === t.value}
                  $color={t.color}
                >
                  {t.label}
                </TypeBtn>
              ))}
            </TypeBtnWrap>
          </div>

          {form.tipo === 'saida' && (
            <div>
              <FormLabel>Motivo da Saída</FormLabel>
              <FormSelect value={form.motivo} onChange={e => set('motivo', e.target.value)} disabled={loading}>
                <option value="">Selecione...</option>
                <option value="Venda">Venda</option>
                <option value="Descarte">Descarte / Perda</option>
                <option value="Uso Interno">Uso Interno</option>
                <option value="Outro">Outro</option>
              </FormSelect>

              {form.motivo === 'Venda' && (
                <NoticeBox>
                  Será registrado automaticamente no <b>Controle de Vendas</b>.
                </NoticeBox>
              )}
            </div>
          )}

          <div>
            <FormLabel>Quantidade</FormLabel>
            <FormInput type="number" min="1" value={form.qtd} onChange={e => set('qtd', e.target.value)} disabled={loading} placeholder="0" />
          </div>

          <div>
            <FormLabel>Origem / Observação</FormLabel>
            <FormInput value={form.obs} onChange={e => set('obs', e.target.value)} disabled={loading} placeholder="Ex: Fornecedor A, Venda #4821..." />
          </div>

          {error && <ErrorBox>{error}</ErrorBox>}

          <ActionsWrap>
            <CancelBtn type="button" onClick={onClose} disabled={loading}>
              Cancelar
            </CancelBtn>
            <SubmitBtn type="button" onClick={handleSubmit} disabled={loading} $loading={loading}>
              {loading ? <><Loader2 size={14} /> Registrando...</> : 'Registrar'}
            </SubmitBtn>
          </ActionsWrap>
        </FormStack>
      </ModalWrapper>
    </Overlay>
  )
}
