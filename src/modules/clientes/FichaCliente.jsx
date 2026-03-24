import React, { useState, useEffect } from 'react'
import { clienteService } from '../../services/clienteService'
import * as S from './ClientesStyles'
import * as F from './FichaClienteStyles'
import { fmtBRL } from '../../utils/format'
import { KPI } from '../../components/ui/KPI'
import { DollarSign, ShoppingBag, TrendingUp } from 'lucide-react'

export function FichaCliente({ clienteId, onClose }) {
  const [cliente, setCliente] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const c = await clienteService.getById(clienteId)
      const h = await clienteService.getHistory(clienteId)
      setCliente(c)
      setHistory(h)
      setLoading(false)
    }
    load()
  }, [clienteId])

  if (loading) return <div>Carregando ficha...</div>
  if (!cliente) return <div>Cliente não encontrado.</div>

  const ticketMedio = cliente.compras > 0 ? cliente.gasto_total / cliente.compras : 0

  return (
    <div>
      <F.ActionHeader>
        <F.ClientTitleArea>
           <h2>{cliente.nome}</h2>
           <S.SegmentBadge type={cliente.segmento} style={{ marginTop: '4px', display: 'inline-block' }}>
              {cliente.segmento}
           </S.SegmentBadge>
        </F.ClientTitleArea>
        <F.BackButton onClick={onClose}>
          Voltar
        </F.BackButton>
      </F.ActionHeader>

      <F.FichaLayout>
        {/* Coluna Esquerda: Dados Principais */}
        <aside>
          <F.Card>
            <h3>Dados de Contato</h3>
            <F.DataItem>
              <label>E-mail</label>
              <span>{cliente.email || '-'}</span>
            </F.DataItem>
            <F.DataItem>
              <label>Telefone</label>
              <span>{cliente.telefone || '-'}</span>
            </F.DataItem>
            <F.DataItem>
              <label>CPF/CNPJ</label>
              <span>{cliente.cpf_cnpj || '-'}</span>
            </F.DataItem>
            <F.DataItem>
              <label>Cidade</label>
              <span>{cliente.cidade || '-'}</span>
            </F.DataItem>
          </F.Card>

          <F.Card>
            <h3>Observações Internas</h3>
            <F.NotesTextarea 
              defaultValue={cliente.obs}
              placeholder="Adicionar notas..."
            />
          </F.Card>
        </aside>

        {/* Coluna Direita: Resumo e Histórico */}
        <main>
          <F.SummaryGrid>
            <KPI label="Total Gasto" value={fmtBRL(cliente.gasto_total)} icon={DollarSign} />
            <KPI label="Nº Pedidos" value={cliente.compras} icon={ShoppingBag} />
            <KPI label="Ticket Médio" value={fmtBRL(ticketMedio)} icon={TrendingUp} />
          </F.SummaryGrid>

          <F.Card>
            <h3>Histórico de Vendas</h3>
            <S.TableWrap style={{ border: 'none' }}>
              <S.Table>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Valor</th>
                    <th>Itens</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(v => (
                    <tr key={v.id}>
                      <td>{new Date(v.data).toLocaleDateString()}</td>
                      <td>
                        <S.ValueText>{fmtBRL(v.valor)}</S.ValueText>
                      </td>
                      <td>{v.itens} itens</td>
                      <td>{v.status}</td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Nenhuma venda registrada.</td>
                    </tr>
                  )}
                </tbody>
              </S.Table>
            </S.TableWrap>
          </F.Card>
        </main>
      </F.FichaLayout>
    </div>
  )
}
