import React, { useContext } from 'react'
import { Eye, Edit2, Trash2, Package } from 'lucide-react'
import { STATUS_ESTOQUE } from '../../data/mock'
import { fmtBRL } from '../../utils/format'
import { Card } from '../../components/ui/Card'
import { Tag } from '../../components/ui/Tag'
import { EmptyState } from '../../components/ui/EmptyState'
import { SkeletonTable } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { ThemeContext } from '../../contexts/ThemeContext'
import {
  TableWrap, StyledTable, Th, Tr, Td, ColorWrap, ColorBadge, ColorName,
  EmptyColor, StockWrap, StockNumber, StockBarBg, StockBarFill,
  ActionsWrap, ActionBtn
} from './TabelaProdutosStyles'

const COR_HEX = {
  'Preto':'#1a1a1a','Branco':'#f5f5f5','Cinza':'#9e9e9e','Azul':'#1565c0',
  'Azul Claro':'#64b5f6','Vermelho':'#c62828','Rosa':'#e91e63','Verde':'#2e7d32',
  'Amarelo':'#f9a825','Laranja':'#e65100','Roxo':'#6a1b9a','Marrom':'#4e342e',
  'Bege':'#d7ccc8','Vinho':'#880e4f',
}

const COLUNAS = ['Código', 'Produto', 'Categoria', 'Cor', 'Estoque', 'Mínimo', 'Custo', 'Preço', 'Status', '']

export function TabelaProdutos({ produtos, loading, error, onRefetch, onEditar, onRemover }) {
  const { theme } = useContext(ThemeContext)

  if (loading) return <Card><SkeletonTable rows={6} cols={9} /></Card>
  if (error)   return <Card><ErrorState error={error} onRetry={onRefetch} /></Card>

  if (!produtos.length) return (
    <Card>
      <EmptyState
        icon={Package}
        title="Nenhum produto encontrado"
        description="Tente ajustar os filtros ou cadastre um novo produto."
      />
    </Card>
  )

  return (
    <TableWrap>
      <StyledTable>
        <thead>
          <tr>
            {COLUNAS.map((h, i) => (
              <Th key={i}>{h}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {produtos.map((p, i) => {
            const cfg = STATUS_ESTOQUE[p.status] ?? STATUS_ESTOQUE.ok
            // Override with theme colors
            const statusColor = cfg.color === '#00d9a8' ? theme.colors.accent 
                              : cfg.color === '#ff5b6b' ? theme.colors.red 
                              : cfg.color === '#f7c948' ? theme.colors.yellow : cfg.color;
            const statusBg = `${statusColor}1A`

            const pct = Math.min(100, Math.round((p.estoque / (p.minimo * 3)) * 100))
            
            return (
              <Tr key={p.id} $isEven={i % 2 === 0}>
                <Td $mono $color={theme.colors.muted}>{p.sku}</Td>
                <Td $fontSize="13px" $weight={600} $color={theme.colors.text}>{p.nome}</Td>
                <Td $color={theme.colors.muted2}>{p.categoria}</Td>
                <Td>
                  {p.cor
                    ? <ColorWrap>
                        <ColorBadge $hex={COR_HEX[p.cor]} $colorName={p.cor} />
                        <ColorName>{p.cor}</ColorName>
                      </ColorWrap>
                    : <EmptyColor>—</EmptyColor>
                  }
                </Td>
                <Td>
                  <StockWrap>
                    <StockNumber $color={statusColor}>{p.estoque}</StockNumber>
                    <StockBarBg>
                      <StockBarFill $pct={pct} $color={statusColor} />
                    </StockBarBg>
                  </StockWrap>
                </Td>
                <Td $color={theme.colors.muted}>{p.minimo}</Td>
                <Td $color={theme.colors.muted2}>{fmtBRL(p.custo)}</Td>
                <Td $fontSize="13px" $weight={600} $color={theme.colors.text}>{fmtBRL(p.preco)}</Td>
                <Td><Tag color={statusColor} bg={statusBg}>{cfg.label}</Tag></Td>
                <Td>
                  <ActionsWrap>
                    <ActionBtn title="Ver">
                      <Eye size={13} color={theme.colors.muted2} />
                    </ActionBtn>
                    <ActionBtn title="Editar" onClick={() => onEditar?.(p)}>
                      <Edit2 size={13} color={theme.colors.muted2} />
                    </ActionBtn>
                    <ActionBtn title="Remover" onClick={() => onRemover?.(p)} $danger>
                      <Trash2 size={13} color={theme.colors.red} />
                    </ActionBtn>
                  </ActionsWrap>
                </Td>
              </Tr>
            )
          })}
        </tbody>
      </StyledTable>
    </TableWrap>
  )
}
