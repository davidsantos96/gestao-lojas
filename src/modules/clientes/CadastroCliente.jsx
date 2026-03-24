import React, { useState } from 'react'
import { clienteService } from '../../services/clienteService'
import * as S from './CadastroClienteStyles'

export function CadastroCliente({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf_cnpj: '',
    nascimento: '',
    cidade: '',
    segmento: 'Regular',
    obs: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await clienteService.create(formData)
      onSave()
    } catch (error) {
      console.error("Erro ao salvar cliente:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <S.Container>
      <S.Header>
        <h2>Cadastro de Novo Cliente</h2>
        <S.ActionButton className="secondary" onClick={onClose}>Voltar para Lista</S.ActionButton>
      </S.Header>

      <S.FormCard as="form" onSubmit={handleSubmit}>
        <S.FormGrid>
          <S.FormGroup>
            <label>Nome Completo*</label>
            <input name="nome" value={formData.nome} onChange={handleChange} required placeholder="Ex: João Silva" />
          </S.FormGroup>

          <S.FormGroup>
            <label>E-mail</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Ex: joao@email.com" />
          </S.FormGroup>

          <S.FormGroup>
            <label>Telefone*</label>
            <input name="telefone" value={formData.telefone} onChange={handleChange} required placeholder="Ex: (11) 98888-7777" />
          </S.FormGroup>

          <S.FormGroup>
            <label>CPF ou CNPJ</label>
            <input name="cpf_cnpj" value={formData.cpf_cnpj} onChange={handleChange} placeholder="Apenas números" />
          </S.FormGroup>

          <S.FormGroup>
            <label>Data de Nascimento</label>
            <input type="date" name="nascimento" value={formData.nascimento} onChange={handleChange} />
          </S.FormGroup>

          <S.FormGroup>
            <label>Cidade</label>
            <input name="cidade" value={formData.cidade} onChange={handleChange} placeholder="Ex: São Paulo" />
          </S.FormGroup>

          <S.FormGroup>
            <label>Segmento Sugerido</label>
            <select name="segmento" value={formData.segmento} onChange={handleChange}>
              <option value="Regular">Regular</option>
              <option value="VIP">VIP</option>
              <option value="Inativo">Inativo</option>
            </select>
          </S.FormGroup>
        </S.FormGrid>

        <S.FormGroup style={{ marginBottom: '24px' }}>
          <label>Observações Iniciais</label>
          <textarea name="obs" value={formData.obs} onChange={handleChange} placeholder="Notas internas sobre o cliente..." />
        </S.FormGroup>

        <S.ButtonGroup>
          <S.ActionButton type="button" className="secondary" onClick={onClose} disabled={loading}>Cancelar</S.ActionButton>
          <S.ActionButton type="submit" className="primary" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Cadastro'}
          </S.ActionButton>
        </S.ButtonGroup>
      </S.FormCard>
    </S.Container>
  )
}
