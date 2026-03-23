import React, { useState, useContext } from 'react'
import { X, Filter, Search, ChevronDown } from 'lucide-react'
import { fmtBRL } from '../../utils/format'
import { Card } from '../../components/ui/Card'
import { Tag } from '../../components/ui/Tag'
import { SkeletonTable } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { useVendas } from '../../hooks/useVendas'
import { cancelarVenda, FORMAS_PAGAMENTO } from '../../services/vendasService'
import { ThemeContext } from '../../contexts/ThemeContext'
import {
  Container, FiltersCard, FiltersRow, FilterTitleWrap, FilterGroup,
  FilterLabel, FilterInput, SearchWrap, SearchInput, ClearFiltersBtn,
  TotalCountBadge, EmptyStateWrap, TableCard, StyledTable, Th, Tr, Td,
  ActionsWrap, ActionBtn, ChevronIconWrap, DetailWrap, DetailHeader,
  DetailTable, DetailTh, DetailTr, DetailTd, DetailTotalWrap
} from './HistoricoVendasStyles'

export function HistoricoVendas() {
  const [filtros,     setFiltros]     = useState({ data_de: '', data_ate: '', cliente: '' })
  const [detalhe,     setDetalhe]     = useState(null)
  const [confirmando, setConfirmando] = useState(null)

  const { theme } = useContext(ThemeContext)

  const STATUS_CFG = {
    concluida: { color: theme.colors.accent,  bg: `${theme.colors.accent}1E`,  label: 'Concluída' },
    cancelada: { color: theme.colors.red,     bg: `${theme.colors.red}1E`,     label: 'Cancelada' },
  }

  const { vendas, pagination, loading, error, refetch } = useVendas(
    Object.fromEntries(Object.entries(filtros).filter(([, v]) => v))
  )

  const total = pagination?.total ?? 0

  const handleCancelar = async (id) => {
    if (confirmando === id) {
      await cancelarVenda(id)
      refetch()
      setConfirmando(null)
      setDetalhe(null)
    } else {
      setConfirmando(id)
      setTimeout(() => setConfirmando(c => c === id ? null : c), 3000)
    }
  }

  const hasFilters = Object.values(filtros).some(v => v)

  if (loading) return <Card><SkeletonTable rows={6} cols={6} /></Card>
  if (error)   return <Card><ErrorState error={error} onRetry={refetch} /></Card>

  return (
    <Container>

      {/* Barra de filtros */}
      <FiltersCard>
        <FiltersRow>
          <FilterTitleWrap>
            <Filter size={13} color={theme.colors.muted} />
            <span>Filtros</span>
          </FilterTitleWrap>

          {[['De', 'data_de'], ['Até', 'data_ate']].map(([label, key]) => (
            <FilterGroup key={key}>
              <FilterLabel>{label}</FilterLabel>
              <FilterInput
                type="date"
                value={filtros[key]}
                onChange={e => setFiltros(f => ({ ...f, [key]: e.target.value }))}
              />
            </FilterGroup>
          ))}

          <FilterGroup>
            <FilterLabel>Cliente</FilterLabel>
            <SearchWrap>
              <Search size={12} className="search-icon" color={theme.colors.muted} />
              <SearchInput
                value={filtros.cliente}
                onChange={e => setFiltros(f => ({ ...f, cliente: e.target.value }))}
                placeholder="Filtrar cliente…"
              />
            </SearchWrap>
          </FilterGroup>

          {hasFilters && (
            <ClearFiltersBtn
              onClick={() => setFiltros({ data_de: '', data_ate: '', cliente: '' })}
            >
              Limpar filtros
            </ClearFiltersBtn>
          )}

          <TotalCountBadge>
            <span className="count">{total}</span>
            <span className="label">venda{total !== 1 ? 's' : ''}</span>
          </TotalCountBadge>
        </FiltersRow>
      </FiltersCard>

      {/* Tabela / Empty */}
      {vendas.length === 0 ? (
        <Card>
          <EmptyStateWrap>
            {hasFilters ? 'Nenhuma venda encontrada para os filtros aplicados.' : 'Nenhuma venda registrada ainda.'}
          </EmptyStateWrap>
        </Card>
      ) : (
        <TableCard>
          <StyledTable>
            <thead>
              <tr style={{ background: theme.colors.s2, borderBottom: `1px solid ${theme.colors.border}` }}>
                {['#', 'Data', 'Cliente', 'Pagamento', 'Itens', 'Total', 'Status', ''].map((h, i) => (
                  <Th key={i}>{h}</Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vendas.map((v, i) => {
                const cfg     = STATUS_CFG[v.status] ?? STATUS_CFG.concluida
                const fpLabel = FORMAS_PAGAMENTO.find(f => f.value === v.forma_pagamento)?.label ?? v.forma_pagamento
                const data    = new Date(v.criado_em).toLocaleDateString('pt-BR')
                const isOpen  = detalhe?.id === v.id
                return (
                  <React.Fragment key={v.id}>
                    <Tr
                      onClick={() => setDetalhe(d => d?.id === v.id ? null : v)}
                      $isOpen={isOpen}
                      $isEven={i % 2 === 0}
                    >
                      <Td $mono $weight={600}>#{v.numero}</Td>
                      <Td $nowrap>{data}</Td>
                      <Td $fontSize="13px" $color={theme.colors.text} $weight={500}>
                        {v.cliente || <span style={{ color: theme.colors.muted }}>—</span>}
                      </Td>
                      <Td $color={theme.colors.muted2} $nowrap>
                        {fpLabel}{v.parcelas > 1 ? ` · ${v.parcelas}x` : ''}
                      </Td>
                      <Td>
                        <span className="items-badge">
                          {v.itens?.length ?? 0}
                        </span>
                      </Td>
                      <Td $fontSize="15px" $weight={800} $color={v.status === 'cancelada' ? theme.colors.muted : theme.colors.accent}>
                        {fmtBRL(v.total_liquido)}
                      </Td>
                      <Td>
                        <Tag color={cfg.color} bg={cfg.bg}>{cfg.label}</Tag>
                      </Td>
                      <Td>
                        <ActionsWrap>
                          {v.status === 'concluida' && (
                            <ActionBtn
                              onClick={e => { e.stopPropagation(); handleCancelar(v.id) }}
                              $confirming={confirmando === v.id}
                            >
                              {confirmando === v.id ? '⚠ Confirmar' : 'Cancelar'}
                            </ActionBtn>
                          )}
                          <ChevronIconWrap $isOpen={isOpen}>
                            <ChevronDown size={14} />
                          </ChevronIconWrap>
                        </ActionsWrap>
                      </Td>
                    </Tr>

                    {/* Detalhe inline */}
                    {isOpen && (
                      <tr key={`${v.id}-detail`}>
                        <td colSpan={8} style={{ padding: 0, borderBottom: `1px solid ${theme.colors.border}` }}>
                          <DetailWrap>
                            {/* Header do detalhe */}
                            <DetailHeader>
                              <span>Itens da Venda #{detalhe.numero}</span>
                              <button onClick={() => setDetalhe(null)}>
                                <X size={14} />
                              </button>
                            </DetailHeader>

                            <DetailTable>
                              <thead>
                                <tr>
                                  {['Produto', 'SKU', 'Qtd', 'Preço Unit.', 'Subtotal'].map((h, i) => (
                                    <DetailTh key={i} $align={i >= 2 ? 'right' : 'left'}>
                                      {h}
                                    </DetailTh>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {(detalhe.itens ?? []).map(item => (
                                  <tr key={item.id}>
                                    <DetailTd $color={theme.colors.text} $weight={500}>{item.produto_nome}</DetailTd>
                                    <DetailTd $fontSize="11px" $mono>{item.produto_sku}</DetailTd>
                                    <DetailTd $align="right">{item.quantidade}</DetailTd>
                                    <DetailTd $align="right">{fmtBRL(item.preco_unitario)}</DetailTd>
                                    <DetailTd $align="right" $fontSize="13px" $weight={700} $color={theme.colors.accent}>
                                      {fmtBRL(item.subtotal)}
                                    </DetailTd>
                                  </tr>
                                ))}
                              </tbody>
                            </DetailTable>

                            <DetailTotalWrap>
                              {detalhe.desconto > 0 && (
                                <div className="discount-text">
                                  Desconto: − {fmtBRL(detalhe.desconto)}
                                </div>
                              )}
                              <div className="total-text">
                                Total: <span className="accent">{fmtBRL(detalhe.total_liquido)}</span>
                              </div>
                            </DetailTotalWrap>
                          </DetailWrap>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </StyledTable>
        </TableCard>
      )}
    </Container>
  )
}
