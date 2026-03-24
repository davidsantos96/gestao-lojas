import { useState, useContext } from 'react'
import { Plus, Minus, Trash2, ShoppingCart, CheckCircle, Search, Package, Tag as TagIcon } from 'lucide-react'
import { fmtBRL } from '../../utils/format'
import { useCarrinho } from '../../hooks/useVendas'
import { FORMAS_PAGAMENTO } from '../../services/vendasService'
import { clienteService } from '../../services/clienteService'
import { ThemeContext } from '../../contexts/ThemeContext'
import {
  SuccessContainer, SuccessIconWrap, SuccessTitle, SuccessText, SuccessBtn,
  GridContainer, LeftCol, SearchCard, SearchInput, SearchClearBtn, ResultCount,
  ProductsGrid, ProductCard, CartBadge, ProductSku, ProductName, ProductPriceRow, ProductPrice, ProductStock,
  EmptyProducts, RightCol, CartCard, CartHeader, CartIconWrap, CartTitleWrap, CartClearBtn,
  CartBody, EmptyCart, CartList, CartItem, CartItemInfo, CartItemName, CartItemPrice,
  QtyControls, QtyBtn, QtyValue, CartItemTotal, RemoveBtn, FormArea, FormLabel,
  FormInput, FormSelect, TotalsBox, TotalRow, TotalRowMain, ErrorBox, SubmitBtn
} from './NovaVendaStyles'

export function NovaVenda({ produtos = [], onVendaConcluida }) {
  const [busca, setBusca] = useState('')
  const [vendaConcluida, setVendaConcluida] = useState(null)
  const [sugestoesClientes, setSugestoesClientes] = useState([])
  
  // Apenas para passar a cor correta de ícones se necessário
  const { theme } = useContext(ThemeContext)

  const {
    itens, cliente, formaPagamento, parcelas, desconto,
    totalBruto, totalLiquido, loading, erro,
    setCliente, setFormaPagamento, setParcelas, setDesconto,
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
    if (venda) { setVendaConcluida(venda); onVendaConcluida?.() }
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

  return (
    <GridContainer>

      {/* ── Coluna Esquerda: Produtos ── */}
      <LeftCol>

        {/* Barra de busca */}
        <SearchCard>
          <div className="search-wrapper">
            <Search size={15} color={theme.colors.muted} />
            <SearchInput
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder="Buscar produto por nome ou SKU…"
            />
            {busca && (
              <SearchClearBtn onClick={() => setBusca('')}>
                limpar
              </SearchClearBtn>
            )}
          </div>
        </SearchCard>

        {/* Contador de resultados */}
        {busca && (
          <ResultCount>
            {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? 's' : ''} encontrado{produtosFiltrados.length !== 1 ? 's' : ''}
          </ResultCount>
        )}

        {/* Grid de produtos */}
        <ProductsGrid>
          {produtosFiltrados.slice(0, 24).map(p => {
            const noCarrinho = itens.find(i => i.produto_id === p.id)
            return (
              <ProductCard
                key={p.id}
                onClick={() => adicionarItem(p)}
                $inCart={!!noCarrinho}
              >
                {noCarrinho && (
                  <CartBadge>
                    {noCarrinho.quantidade}
                  </CartBadge>
                )}
                <ProductSku>{p.sku}</ProductSku>
                <ProductName $inCart={!!noCarrinho}>{p.nome}</ProductName>
                <ProductPriceRow>
                  <ProductPrice>{fmtBRL(p.preco)}</ProductPrice>
                  <ProductStock>{p.estoque} un</ProductStock>
                </ProductPriceRow>
              </ProductCard>
            )
          })}

          {produtosFiltrados.length === 0 && (
            <EmptyProducts>
              <Package size={32} color={theme.colors.border} />
              <span>Nenhum produto disponível em estoque.</span>
            </EmptyProducts>
          )}
        </ProductsGrid>
      </LeftCol>

      {/* ── Coluna Direita: Carrinho ── */}
      <RightCol>
        <CartCard>

          {/* Cabeçalho do carrinho */}
          <CartHeader>
            <CartIconWrap>
              <ShoppingCart size={15} color={theme.colors.blue} />
            </CartIconWrap>
            <CartTitleWrap>
              <div className="title">Carrinho</div>
              <div className="subtitle">
                {itens.length === 0 ? 'Vazio' : `${itens.length} item${itens.length !== 1 ? 's' : ''}`}
              </div>
            </CartTitleWrap>
            {itens.length > 0 && (
              <CartClearBtn onClick={limpar}>
                Limpar
              </CartClearBtn>
            )}
          </CartHeader>

          <CartBody>
            {/* Itens do carrinho */}
            {itens.length === 0 ? (
              <EmptyCart>
                <TagIcon size={24} color={theme.colors.border} />
                <span>Clique em um produto para adicionar</span>
              </EmptyCart>
            ) : (
              <CartList>
                {itens.map(item => (
                  <CartItem key={item.produto_id}>
                    <CartItemInfo>
                      <CartItemName>{item.nome}</CartItemName>
                      <CartItemPrice>
                        {fmtBRL(item.preco_unitario)} × {item.quantidade}
                      </CartItemPrice>
                    </CartItemInfo>

                    {/* Controles de quantidade */}
                    <QtyControls>
                      <QtyBtn onClick={() => atualizarQtd(item.produto_id, item.quantidade - 1)}>
                        <Minus size={10} color={theme.colors.muted} />
                      </QtyBtn>
                      <QtyValue>{item.quantidade}</QtyValue>
                      <QtyBtn
                        onClick={() => atualizarQtd(item.produto_id, item.quantidade + 1)}
                        disabled={item.quantidade >= item.estoque}
                      >
                        <Plus size={10} color={theme.colors.muted} />
                      </QtyBtn>
                    </QtyControls>

                    <CartItemTotal>
                      {fmtBRL(item.preco_unitario * item.quantidade)}
                    </CartItemTotal>
                    <RemoveBtn onClick={() => removerItem(item.produto_id)}>
                      <Trash2 size={13} color={theme.colors.red} />
                    </RemoveBtn>
                  </CartItem>
                ))}
              </CartList>
            )}

            {/* Formulário */}
            <FormArea>
              <div>
                <FormLabel>Cliente (opcional)</FormLabel>
                <FormInput 
                  value={cliente} 
                  onChange={async e => {
                    const val = e.target.value
                    setCliente(val)
                    if (val.length >= 3) {
                      const sug = await clienteService.search(val)
                      setSugestoesClientes(sug)
                    } else {
                      setSugestoesClientes([])
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
                <FormLabel>Forma de Pagamento</FormLabel>
                <FormSelect value={formaPagamento} onChange={e => setFormaPagamento(e.target.value)}>
                  {FORMAS_PAGAMENTO.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </FormSelect>
              </div>
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

              {/* Totais */}
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

              {erro && (
                <ErrorBox>{erro}</ErrorBox>
              )}

              <SubmitBtn
                onClick={handleFinalizar}
                disabled={loading || !itens.length}
              >
                {loading ? 'Registrando…' : '✓ Finalizar Venda'}
              </SubmitBtn>
            </FormArea>
          </CartBody>
        </CartCard>
      </RightCol>

    </GridContainer>
  )
}
