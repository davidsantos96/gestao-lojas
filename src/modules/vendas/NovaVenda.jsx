import { useState, useContext } from 'react'
import { Plus, Minus, Trash2, ShoppingCart, CheckCircle, Search, Package, Tag as TagIcon, X, Banknote, QrCode, CreditCard, Barcode, LayoutGrid } from 'lucide-react'
import { fmtBRL } from '../../utils/format'
import { useCarrinho } from '../../hooks/useVendas'
import { FORMAS_PAGAMENTO } from '../../services/vendasService'
import { clienteService } from '../../services/clienteService'
import { ThemeContext } from '../../contexts/ThemeContext'
import {
  SuccessContainer, SuccessIconWrap, SuccessTitle, SuccessText, SuccessBtn,
  MainContainer, SearchCard, SearchInput, SearchClearBtn,
  TableCard, Table, Thead, Th, Tr, Td, SkuBadge, ProductInfo, ProductPrice, ActionBtn, EmptyProducts,
  FloatingCartBtn,
  DrawerOverlay, DrawerContent, DrawerHeader, DrawerCloseBtn,
  CartBody, EmptyCart, CartList, CartItem, CartItemInfo, CartItemName, CartItemPrice,
  QtyControls, QtyBtn, QtyValue, CartItemTotal, RemoveBtn, FormArea, FormLabel,
  FormInput, FormSelect, TotalsBox, TotalRow, TotalRowMain, ErrorBox, SubmitBtn,
  PaymentMethodGrid, PaymentMethodBtn
} from './NovaVendaStyles'

export function NovaVenda({ produtos = [], onVendaConcluida }) {
  const [busca, setBusca] = useState('')
  const [vendaConcluida, setVendaConcluida] = useState(null)
  const [sugestoesClientes, setSugestoesClientes] = useState([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  
  const { theme } = useContext(ThemeContext)

  const {
    itens, cliente, formaPagamento, parcelas, desconto,
    totalBruto, totalLiquido, loading, erro,
    setCliente, setClienteId, setFormaPagamento, setParcelas, setDesconto,
    adicionarItem, removerItem, atualizarQtd, limpar, finalizar,
  } = useCarrinho()

  const produtosFiltrados = produtos.filter(p =>
    p.estoque > 0 && (
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.sku.toLowerCase().includes(busca.toLowerCase())
    )
  )

  const handleFinalizar = async () => {
    const venda = await finalizar()
    if (venda) { 
      setVendaConcluida(venda)
      setIsDrawerOpen(false)
      onVendaConcluida?.() 
    }
  }

  /* ── Tela de sucesso ── */
  if (vendaConcluida) return (
    <SuccessContainer>
      <SuccessIconWrap>
        <CheckCircle size={40} color={theme.colors.accent} />
      </SuccessIconWrap>
      <div style={{ textAlign: 'center' }}>
        <SuccessTitle>
          Venda #{vendaConcluida.numero} registrada!
        </SuccessTitle>
        <SuccessText>
          {vendaConcluida.cliente && (
            <><strong>{vendaConcluida.cliente}</strong> &middot; </>
          )}
          <span className="accent">{fmtBRL(vendaConcluida.total_liquido)}</span>
          {' '}&middot; {FORMAS_PAGAMENTO.find(f => f.value === vendaConcluida.forma_pagamento)?.label}
        </SuccessText>
      </div>
      <SuccessBtn onClick={() => setVendaConcluida(null)}>
        + Nova Venda
      </SuccessBtn>
    </SuccessContainer>
  )

  const qtyCarrinho = itens.reduce((acc, i) => acc + i.quantidade, 0)

  return (
    <>
      <MainContainer>
        {/* Barra de busca */}
        <SearchCard>
          <div className="search-wrapper">
            <Search size={18} color={theme.colors.muted} />
            <SearchInput
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder="Buscar produto por nome ou SKU…"
              autoFocus
            />
            {busca && (
              <SearchClearBtn onClick={() => setBusca('')}>
                LIMPAR
              </SearchClearBtn>
            )}
          </div>
        </SearchCard>

        {/* Tabela de Produtos */}
        <TableCard>
          <Table>
            <Thead>
              <Tr>
                <Th>Produto</Th>
                <Th>Estoque</Th>
                <Th>Preço</Th>
                <Th>Ação</Th>
              </Tr>
            </Thead>
            <tbody>
              {produtosFiltrados.slice(0, 30).map(p => {
                const itemCarrinho = itens.find(i => i.produto_id === p.id)
                return (
                  <Tr key={p.id} $inCart={!!itemCarrinho}>
                    <Td>
                      <ProductInfo>
                        <div className="name">{p.nome}</div>
                        <div className="tags">
                          <SkuBadge>{p.sku}</SkuBadge>
                          {itemCarrinho && <span className="incart">No carrinho ({itemCarrinho.quantidade})</span>}
                        </div>
                      </ProductInfo>
                    </Td>
                    <Td>
                      <span style={{ color: theme.colors.muted, fontSize: 13 }}>{p.estoque} un</span>
                    </Td>
                    <Td>
                      <ProductPrice>{fmtBRL(p.preco)}</ProductPrice>
                    </Td>
                    <Td>
                      <ActionBtn 
                        onClick={() => adicionarItem(p)}
                        $inCart={!!itemCarrinho}
                      >
                        {itemCarrinho ? '+ Adicionar Mais' : '+ Adicionar'}
                      </ActionBtn>
                    </Td>
                  </Tr>
                )
              })}
            </tbody>
          </Table>
          
          {produtosFiltrados.length === 0 && (
            <EmptyProducts>
              <Package size={32} color={theme.colors.border} />
              <span>Nenhum produto encontrado.</span>
            </EmptyProducts>
          )}
        </TableCard>
      </MainContainer>

      {/* Floating Button */}
      <FloatingCartBtn onClick={() => setIsDrawerOpen(true)}>
        <div className="icon-wrap">
          <ShoppingCart size={24} />
          {qtyCarrinho > 0 && <div className="badge">{qtyCarrinho}</div>}
        </div>
        <div className="text-wrap">
          <span className="lbl">Carrinho</span>
          <span className="val">{fmtBRL(totalLiquido)}</span>
        </div>
      </FloatingCartBtn>

      {/* Drawer */}
      {isDrawerOpen && (
        <DrawerOverlay onClick={() => setIsDrawerOpen(false)}>
          <DrawerContent onClick={e => e.stopPropagation()}>
            <DrawerHeader>
              <div className="title">
                <ShoppingCart size={18} color={theme.colors.accent} />
                Checkout
              </div>
              <DrawerCloseBtn onClick={() => setIsDrawerOpen(false)}>
                <X size={20} />
              </DrawerCloseBtn>
            </DrawerHeader>

            <CartBody>
              {itens.length === 0 ? (
                <EmptyCart>
                  <TagIcon size={24} color={theme.colors.border} />
                  <span>Nenhum item adicionado</span>
                </EmptyCart>
              ) : (
                <CartList>
                  {itens.map(item => (
                    <CartItem key={item.produto_id}>
                      <CartItemInfo>
                        <CartItemName>{item.nome}</CartItemName>
                        <CartItemPrice>
                          {fmtBRL(item.preco_unitario)}
                        </CartItemPrice>
                      </CartItemInfo>

                      <QtyControls>
                        <QtyBtn onClick={() => atualizarQtd(item.produto_id, item.quantidade - 1)}>
                          <Minus size={12} />
                        </QtyBtn>
                        <QtyValue>{item.quantidade}</QtyValue>
                        <QtyBtn
                          onClick={() => atualizarQtd(item.produto_id, item.quantidade + 1)}
                          disabled={item.quantidade >= item.estoque}
                        >
                          <Plus size={12} />
                        </QtyBtn>
                      </QtyControls>

                      <CartItemTotal>
                        {fmtBRL(item.preco_unitario * item.quantidade)}
                      </CartItemTotal>
                      <RemoveBtn onClick={() => removerItem(item.produto_id)}>
                        <Trash2 size={16} />
                      </RemoveBtn>
                    </CartItem>
                  ))}
                </CartList>
              )}
            </CartBody>

            <FormArea>
              <div>
                <FormLabel>Cliente (opcional)</FormLabel>
                <FormInput 
                  value={cliente} 
                  onChange={async e => {
                    const val = e.target.value
                    setCliente(val)
                    if (!val) { setClienteId(null); setSugestoesClientes([]); return }
                    if (val.length >= 3) {
                      const sug = await clienteService.search(val)
                      setSugestoesClientes(sug)
                      const match = sug.find(c => c.nome === val)
                      setClienteId(match ? match.id : null)
                    } else {
                      setSugestoesClientes([])
                      setClienteId(null)
                    }
                  }} 
                  placeholder="Nome do cliente..." 
                  list="clientes-sugestoes"
                />
                <datalist id="clientes-sugestoes">
                  {sugestoesClientes.map(c => (
                    <option key={c.id} value={c.nome} />
                  ))}
                </datalist>
              </div>
              
              <div>
                <FormLabel>Pagamento</FormLabel>
                <PaymentMethodGrid>
                  {FORMAS_PAGAMENTO.map(f => {
                    let Icon = CreditCard
                    if (f.value === 'DINHEIRO') Icon = Banknote
                    if (f.value === 'PIX') Icon = QrCode
                    if (f.value === 'BOLETO') Icon = Barcode
                    if (f.value === 'OUTRO') Icon = LayoutGrid
                    
                    let labelStr = f.label
                    if (f.value === 'CARTAO_CREDITO') labelStr = 'Crédito'
                    if (f.value === 'CARTAO_DEBITO') labelStr = 'Débito'
                    
                    return (
                      <PaymentMethodBtn
                        key={f.value}
                        $active={formaPagamento === f.value}
                        onClick={(e) => {
                          e.preventDefault()
                          setFormaPagamento(f.value)
                        }}
                      >
                        <div className="icon-holder"><Icon size={20} /></div>
                        <span>{labelStr}</span>
                      </PaymentMethodBtn>
                    )
                  })}
                </PaymentMethodGrid>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: formaPagamento === 'CARTAO_CREDITO' ? '1fr 1fr' : '1fr', gap: '12px' }}>
                {formaPagamento === 'CARTAO_CREDITO' && (
                  <div>
                    <FormLabel>Parcelas</FormLabel>
                    <FormSelect value={parcelas} onChange={e => setParcelas(Number(e.target.value))}>
                      {[1, 2, 3, 4, 6, 8, 10, 12].map(n => <option key={n} value={n}>{n === 1 ? 'À vista' : `${n}x`}</option>)}
                    </FormSelect>
                  </div>
                )}
                <div>
                  <FormLabel>Desconto (R$)</FormLabel>
                  <FormInput
                    type="number" min="0" step="0.01"
                    value={desconto} onChange={e => setDesconto(Number(e.target.value))}
                    placeholder="0,00"
                  />
                </div>
              </div>

              <TotalsBox>
                <TotalRow>
                  <span>Subtotal</span>
                  <span>{fmtBRL(totalBruto)}</span>
                </TotalRow>
                {desconto > 0 && (
                  <TotalRow $discount>
                    <span>Desconto</span>
                    <span>− {fmtBRL(desconto)}</span>
                  </TotalRow>
                )}
                <TotalRowMain>
                  <span>Total</span>
                  <span className="accent">{fmtBRL(totalLiquido)}</span>
                </TotalRowMain>
              </TotalsBox>

              {erro && <ErrorBox>{erro}</ErrorBox>}

              <SubmitBtn onClick={handleFinalizar} disabled={loading || !itens.length}>
                {loading ? 'Processando…' : 'Finalizar Venda'}
              </SubmitBtn>
            </FormArea>
          </DrawerContent>
        </DrawerOverlay>
      )}
    </>
  )
}
