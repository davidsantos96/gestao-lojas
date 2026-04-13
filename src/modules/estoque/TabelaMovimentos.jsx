import React, { useContext } from 'react'
import { History } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Tag } from '../../components/ui/Tag'
import { SkeletonTable } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { EmptyState } from '../../components/ui/EmptyState'
import { Pagination } from '../../components/ui/Pagination'
import { usePagination } from '../../hooks/usePagination'
import { ThemeContext } from '../../contexts/ThemeContext'
import { TableWrap, StyledTable, Th, Tr, Td } from './TabelaMovimentosStyles'

export function TabelaMovimentos({ movimentos, loading, error, onRefetch }) {
  const { theme } = useContext(ThemeContext)
  const pagination = usePagination(movimentos ?? [])

  const TIPO_CONFIG = {
    entrada: { label: 'Entrada', color: theme.colors.accent, bg: `${theme.colors.accent}1A` },
    saida:   { label: 'Saída',   color: theme.colors.red,    bg: `${theme.colors.red}1A` },
    ajuste:  { label: 'Ajuste',  color: theme.colors.yellow, bg: `${theme.colors.yellow}1A` },
  }

  if (loading) return <Card><SkeletonTable rows={6} cols={6} /></Card>
  if (error)   return <Card><ErrorState error={error} onRetry={onRefetch} /></Card>
  if (!movimentos.length) return (
    <Card>
      <EmptyState icon={History} title="Nenhuma movimentação registrada" description="As movimentações de estoque aparecerão aqui." />
    </Card>
  )

  return (
    <TableWrap>
      <StyledTable>
        <thead>
          <tr>
            {['Data', 'Produto', 'Tipo', 'Qtd', 'Responsável', 'Origem'].map((h, i) => (
              <Th key={i}>{h}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pagination.paginatedItems.map((m, i) => {
            const cfg = TIPO_CONFIG[m.tipo] ?? TIPO_CONFIG.ajuste
            return (
              <Tr key={m.id} $isEven={i % 2 === 0}>
                <Td $mono $color={theme.colors.muted}>{m.data}</Td>
                <Td $fontSize="13px" $weight={600} $color={theme.colors.text}>{m.produto}</Td>
                <Td><Tag color={cfg.color} bg={cfg.bg}>{cfg.label}</Tag></Td>
                <Td $fontSize="14px" $weight={700} $color={cfg.color}>
                  {m.tipo === 'entrada' ? '+' : ''}{m.qtd}
                </Td>
                <Td $color={theme.colors.muted2}>{m.responsavel}</Td>
                <Td $color={theme.colors.muted}>{m.origem}</Td>
              </Tr>
            )
          })}
        </tbody>
      </StyledTable>
      <Pagination {...pagination} />
    </TableWrap>
  )
}
