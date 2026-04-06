import { useState, useContext } from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import { ThemeContext } from '../../contexts/ThemeContext'
import { fmtBRL } from '../../utils/format'
import { Card } from '../../components/ui/Card'
import { Tag } from '../../components/ui/Tag'
import { SkeletonTable } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import {
  TableWrap, StyledTable, Th, Tr, Td, SectionWrap, SectionHeader, DeleteBtn, IconBtnWrap, IconBtn
} from './TabelasFinanceiroStyles'

export function Lancamentos({ titulo, lancamentos = [], total = 0, loading, error, onRefetch, onEditar, onRemover }) {
  const [confirmando, setConfirmando] = useState(null)
  const { theme } = useContext(ThemeContext)

  const TIPO_CFG = {
    RECEITA: { color: theme.colors.accent, bg: 'rgba(0,217,168,.12)', label: 'Receita' },
    DESPESA: { color: theme.colors.red,   bg: 'rgba(255,91,107,.12)', label: 'Despesa' },
  }

  const handleRemover = (id) => {
    if (confirmando === id) {
      onRemover?.(id)
      setConfirmando(null)
    } else {
      setConfirmando(id)
      setTimeout(() => setConfirmando(c => c === id ? null : c), 3000)
    }
  }

  if (loading) return <SectionWrap>{titulo && <SectionHeader>{titulo}</SectionHeader>}<Card><SkeletonTable rows={4} cols={6} /></Card></SectionWrap>
  if (error)   return <SectionWrap>{titulo && <SectionHeader>{titulo}</SectionHeader>}<Card><ErrorState error={error} onRetry={onRefetch} /></Card></SectionWrap>
  if (!lancamentos.length) return null

  return (
    <SectionWrap>
      {titulo && (
        <SectionHeader>
          {titulo}
          <span>({total})</span>
        </SectionHeader>
      )}
      <Card style={{ overflow: 'hidden' }}>
        <TableWrap>
          <StyledTable>
            <thead>
              <tr>
                {['Data', 'Tipo', 'Descrição', 'Parcelas', 'Valor', ''].map((h, i) => (
                  <Th key={i} style={{ textAlign: i === 4 ? 'right' : 'left' }}>
                    {h}
                  </Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lancamentos.map((l, i) => {
                const cfg  = TIPO_CFG[l.tipo] ?? TIPO_CFG.DESPESA
                const data = l.data 
                  ? (l.data.includes('/') ? l.data : l.data.split('T')[0].split('-').reverse().join('/'))
                  : '—'
                return (
                  <Tr key={l.id} $isEven={i % 2 === 0}>
                    <Td $fontSize="12px" $color={theme.colors.muted} $mono style={{ whiteSpace: 'nowrap' }}>{data}</Td>
                    <Td>
                      <Tag color={cfg.color} bg={cfg.bg}>{cfg.label}</Tag>
                    </Td>
                    <Td $fontSize="13px" $weight={600} $color={theme.colors.text}>{l.descricao}</Td>
                    <Td $fontSize="12px" $color={theme.colors.muted} $mono style={{ textAlign: 'center' }}>
                      {l.tipo === 'DESPESA' && l.parcelas && l.parcelas > 1 ? `${l.parcelas}x` : '—'}
                    </Td>
                    <Td $fontSize="14px" $weight={700} $color={cfg.color} $mono style={{ textAlign: 'right' }}>
                      {l.tipo === 'DESPESA' ? '−' : '+'}{fmtBRL(l.valor)}
                    </Td>
                    <Td>
                      <IconBtnWrap style={{ justifyContent: 'flex-end' }}>
                        {onEditar && (
                          <IconBtn onClick={() => onEditar(l)} title="Editar">
                            <Edit2 size={13} />
                          </IconBtn>
                        )}
                        {onRemover && (
                          <DeleteBtn
                            onClick={() => handleRemover(l.id)}
                            title={confirmando === l.id ? 'Confirmar exclusão' : 'Excluir'}
                            $confirming={confirmando === l.id}
                          >
                            <Trash2 size={13} color={theme.colors.red} />
                            {confirmando === l.id && <span>Confirmar?</span>}
                          </DeleteBtn>
                        )}
                      </IconBtnWrap>
                    </Td>
                  </Tr>
                )
              })}
            </tbody>
          </StyledTable>
        </TableWrap>
      </Card>
    </SectionWrap>
  )
}

