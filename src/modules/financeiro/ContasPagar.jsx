import { useState, useContext } from 'react'
import { DollarSign, Paperclip } from 'lucide-react'
import { ThemeContext } from '../../contexts/ThemeContext'
import { fmtBRL } from '../../utils/format'
import { Card } from '../../components/ui/Card'
import { Tag } from '../../components/ui/Tag'
import { SkeletonTable } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { EmptyState } from '../../components/ui/EmptyState'
import { ModalAnexos } from './ModalAnexos'
import { STATUS_FIN } from '../../data/mock'
import {
  TableWrap, StyledTable, Th, Tr, Td, TableFooter, TotalText, TotalValue, ActionButton, AttachmentBtn
} from './TabelasFinanceiroStyles'

export function ContasPagar({ contas, totalPendente, loading, error, onRefetch, onPagar }) {
  // anexos: { [contaId]: [{ id, nome, tipo, tamanho, url }] }
  const [anexos,      setAnexos]      = useState({})
  const [contaAnexos, setContaAnexos] = useState(null)   // conta selecionada para o modal

  const { theme } = useContext(ThemeContext)

  const getAnexos = (id) => anexos[id] ?? []

  const handleAnexar = (contaId, arquivo) => {
    setAnexos(prev => ({ ...prev, [contaId]: [...(prev[contaId] ?? []), arquivo] }))
  }

  const handleRemover = (contaId, arquivoId) => {
    setAnexos(prev => ({
      ...prev,
      [contaId]: (prev[contaId] ?? []).filter(a => a.id !== arquivoId),
    }))
  }

  if (loading) return <Card><SkeletonTable rows={5} cols={7} /></Card>
  if (error)   return <Card><ErrorState error={error} onRetry={onRefetch} /></Card>
  if (!contas.length) return <Card><EmptyState icon={DollarSign} title="Nenhuma conta a pagar" /></Card>

  return (
    <>
      <Card style={{ overflow: 'hidden' }}>
        <TableWrap>
          <StyledTable>
            <thead>
              <tr>
                {['Descrição', 'Vencimento', 'Categoria', 'Valor', 'Anexos', 'Status', ''].map((h, i) => (
                  <Th key={i}>{h}</Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contas.map((c, i) => {
                const cfg       = STATUS_FIN[c.status] ?? STATUS_FIN.pendente
                const qtdAnexos = getAnexos(c.id).length

                return (
                  <Tr key={c.id} $isEven={i % 2 === 0}>
                    <Td $fontSize="13px" $weight={600} $color={theme.colors.text}>{c.descricao}</Td>
                    <Td $fontSize="12px" $color={theme.colors.muted} $mono>{c.vencimento}</Td>
                    <Td $fontSize="12px" $color={theme.colors.muted2}>{c.categoria}</Td>
                    <Td $fontSize="14px" $weight={700} $color={theme.colors.text}>{fmtBRL(c.valor)}</Td>

                    {/* Coluna Anexos */}
                    <Td>
                      <AttachmentBtn
                        onClick={() => setContaAnexos(c)}
                        title={qtdAnexos > 0 ? `${qtdAnexos} arquivo(s)` : 'Anexar documento'}
                        $hasAnexos={qtdAnexos > 0}
                      >
                        <Paperclip size={12} />
                        {qtdAnexos > 0 ? qtdAnexos : 'Anexar'}
                      </AttachmentBtn>
                    </Td>

                    <Td><Tag color={cfg.color} bg={cfg.bg}>{cfg.label}</Tag></Td>

                    <Td>
                      {c.status !== 'pago' && (
                        <ActionButton
                          onClick={() => onPagar?.(c.id)}
                          $bg="rgba(0,217,168,.1)"
                          $border={`${theme.colors.accent}44`}
                          $color={theme.colors.accent}
                        >
                          Pagar
                        </ActionButton>
                      )}
                    </Td>
                  </Tr>
                )
              })}
            </tbody>
          </StyledTable>
        </TableWrap>
        <TableFooter>
          <TotalText>
            Total pendente: <TotalValue $color={theme.colors.red}>{fmtBRL(totalPendente)}</TotalValue>
          </TotalText>
        </TableFooter>
      </Card>

      {/* Modal de Anexos */}
      {contaAnexos && (
        <ModalAnexos
          conta={contaAnexos}
          anexos={getAnexos(contaAnexos.id)}
          onClose={() => setContaAnexos(null)}
          onAnexar={arquivo => handleAnexar(contaAnexos.id, arquivo)}
          onRemover={arquivoId => handleRemover(contaAnexos.id, arquivoId)}
        />
      )}
    </>
  )
}

