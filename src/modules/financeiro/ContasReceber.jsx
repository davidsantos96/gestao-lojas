import { useContext } from 'react'
import { ThemeContext } from '../../contexts/ThemeContext'
import { fmtBRL } from '../../utils/format'
import { Card } from '../../components/ui/Card'
import { Tag } from '../../components/ui/Tag'
import { SkeletonTable } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { EmptyState } from '../../components/ui/EmptyState'
import { TrendingUp } from 'lucide-react'
import { STATUS_FIN } from '../../data/mock'
import {
  TableWrap, StyledTable, Th, Tr, Td, TableFooter, TotalText, TotalValue, ActionButton
} from './TabelasFinanceiroStyles'

export function ContasReceber({ contas, totalPendente, loading, error, onRefetch, onReceber }) {
  const { theme } = useContext(ThemeContext)

  if (loading) return <Card><SkeletonTable rows={5} cols={6} /></Card>
  if (error)   return <Card><ErrorState error={error} onRetry={onRefetch} /></Card>
  if (!contas.length) return <Card><EmptyState icon={TrendingUp} title="Nenhuma conta a receber" /></Card>

  return (
    <Card style={{ overflow: 'hidden' }}>
      <TableWrap>
        <StyledTable>
          <thead>
            <tr>
              {['Descrição', 'Cliente', 'Vencimento', 'Valor', 'Status', ''].map((h, i) => (
                <Th key={i}>{h}</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contas.map((c, i) => {
              const cfg = STATUS_FIN[c.status] ?? STATUS_FIN.pendente
              return (
                <Tr key={c.id} $isEven={i % 2 === 0}>
                  <Td $fontSize="13px" $weight={600} $color={theme.colors.text}>{c.descricao}</Td>
                  <Td $fontSize="12px" $color={theme.colors.muted2}>{c.cliente}</Td>
                  <Td $fontSize="12px" $color={theme.colors.muted} $mono>{c.vencimento}</Td>
                  <Td $fontSize="14px" $weight={700} $color={theme.colors.text}>{fmtBRL(c.valor)}</Td>
                  <Td><Tag color={cfg.color} bg={cfg.bg}>{cfg.label}</Tag></Td>
                  <Td>
                    {c.status !== 'recebido' && (
                      <ActionButton
                        onClick={() => onReceber?.(c.id)}
                        $bg="rgba(79,143,255,.1)"
                        $border={`${theme.colors.blue}44`}
                        $color={theme.colors.blue}
                      >
                        Receber
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
          Total a receber: <TotalValue $color={theme.colors.accent}>{fmtBRL(totalPendente)}</TotalValue>
        </TotalText>
      </TableFooter>
    </Card>
  )
}

