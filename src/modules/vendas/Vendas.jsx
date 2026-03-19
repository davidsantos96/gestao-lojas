import { useState, useMemo, useEffect, useRef } from 'react'

function useDebounce(value, delay = 250) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}
import { ShoppingCart, Search, TrendingUp, TrendingDown, Minus, ReceiptText } from 'lucide-react'
import { C } from '../../constants/theme'
import { fmtBRL, fmtPct } from '../../utils/format'
import { useVendas, useResumoMesVendas } from '../../hooks/useVendas'
import { Card } from '../../components/ui/Card'
import { SkeletonTable } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { EmptyState } from '../../components/ui/EmptyState'

// ── Card de resumo do mês ─────────────────────────────────────────────────────
function CardResumoMes() {
  const { totalMes, transacoesMes, variacao, totalMesAnterior, loading } = useResumoMesVendas()

  const mesAtual = new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' })

  const variacaoPositiva = variacao !== null && variacao >= 0
  const variacaoNeutral  = variacao === null

  const TrendIcon = variacaoNeutral ? Minus : variacaoPositiva ? TrendingUp : TrendingDown
  const trendColor = variacaoNeutral ? C.muted : variacaoPositiva ? C.accent : C.red

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 16,
      marginBottom: 24,
    }}>
      {/* Card principal — total do mês */}
      <div style={{
        background: `linear-gradient(135deg, ${C.s2} 0%, ${C.s3} 100%)`,
        border: `1px solid ${C.accent}30`,
        borderRadius: 14,
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow decorativo */}
        <div style={{
          position: 'absolute', top: -30, right: -30,
          width: 100, height: 100, borderRadius: '50%',
          background: `${C.accent}12`, pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 11, color: C.accent, fontFamily: 'monospace', letterSpacing: 2, textTransform: 'uppercase' }}>
            Total vendas — {mesAtual}
          </div>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: `${C.accent}18`,
            border: `1px solid ${C.accent}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShoppingCart size={15} color={C.accent} />
          </div>
        </div>

        {loading ? (
          <div style={{ height: 36, background: C.s3, borderRadius: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />
        ) : (
          <div style={{ fontSize: 28, fontWeight: 800, color: C.text, letterSpacing: -1, lineHeight: 1 }}>
            {fmtBRL(totalMes)}
          </div>
        )}

        {/* Variação vs mês anterior */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          <TrendIcon size={13} color={trendColor} />
          {variacaoNeutral ? (
            <span style={{ color: C.muted }}>Sem dados do mês anterior</span>
          ) : (
            <>
              <span style={{ color: trendColor, fontWeight: 700 }}>
                {variacao >= 0 ? '+' : ''}{fmtPct(variacao)}
              </span>
              <span style={{ color: C.muted }}>
                vs mês anterior ({fmtBRL(totalMesAnterior)})
              </span>
            </>
          )}
        </div>
      </div>

      {/* Card secundário — nº de transações */}
      <div style={{
        background: C.s2,
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 11, color: C.muted, fontFamily: 'monospace', letterSpacing: 2, textTransform: 'uppercase' }}>
            Transações no mês
          </div>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: `${C.blue}18`,
            border: `1px solid ${C.blue}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ReceiptText size={15} color={C.blue} />
          </div>
        </div>

        {loading ? (
          <div style={{ height: 36, background: C.s3, borderRadius: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />
        ) : (
          <div style={{ fontSize: 28, fontWeight: 800, color: C.text, letterSpacing: -1, lineHeight: 1 }}>
            {transacoesMes.toLocaleString('pt-BR')}
          </div>
        )}

        {!loading && totalMes > 0 && (
          <div style={{ fontSize: 12, color: C.muted }}>
            Ticket médio: <span style={{ color: C.text, fontWeight: 600 }}>{fmtBRL(totalMes / transacoesMes)}</span>
          </div>
        )}
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }`}</style>
    </div>
  )
}

// ── Módulo principal ──────────────────────────────────────────────────────────
export function Vendas() {
  const [busca, setBusca] = useState('')
  const buscaDebounced = useDebounce(busca, 250)
  const { vendas, loading, error, refetch } = useVendas()

  const filtradas = useMemo(() => {
    if (!buscaDebounced) return vendas
    const q = buscaDebounced.toLowerCase()
    return vendas.filter(v =>
      v.produto_nome.toLowerCase().includes(q) ||
      v.produto_sku.toLowerCase().includes(q)
    )
  }, [vendas, buscaDebounced])

  if (loading) return <div><SkeletonTable rows={8} cols={7} /></div>
  if (error) return <ErrorState error={error} onRetry={refetch} />

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: C.accent, fontFamily: 'monospace', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>Módulo</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, letterSpacing: -0.5 }}>Controle de Vendas</h2>
        </div>
      </div>

      {/* ── Cards de resumo do mês ── */}
      <CardResumoMes />

      {/* ── Filtro de busca ── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={14} color={C.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por produto ou código..."
            style={{ width: '100%', padding: '9px 12px 9px 34px', background: C.s2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, outline: 'none' }}
          />
        </div>
      </div>

      {/* ── Tabela ── */}
      {filtradas.length === 0 ? (
        <Card><EmptyState icon={ShoppingCart} title="Nenhuma venda encontrada" /></Card>
      ) : (
        <Card style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {['Data', 'Produto', 'Código', 'Cor', 'Categoria', 'Qtd', 'Unitário', 'Total'].map((h, i) => (
                  <th key={i} style={{ padding: '12px 16px', textAlign: i >= 5 ? 'right' : 'left', fontSize: 11, color: C.muted, fontFamily: 'monospace', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 500, whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtradas.map((v, i) => (
                <tr key={v.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.01)' }}>
                  <td style={{ padding: '13px 16px', fontSize: 12, color: C.muted, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{v.data}</td>
                  <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 600, color: C.text }}>{v.produto_nome}</td>
                  <td style={{ padding: '13px 16px', fontSize: 12, color: C.muted2 }}>{v.produto_sku}</td>
                  <td style={{ padding: '13px 16px', fontSize: 12, color: C.muted2 }}>{v.produto_cor || '—'}</td>
                  <td style={{ padding: '13px 16px', fontSize: 12, color: C.muted2 }}>{v.produto_cat}</td>
                  <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 700, color: C.text, textAlign: 'right' }}>{v.quantidade}</td>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: C.text, textAlign: 'right' }}>{fmtBRL(v.preco_unitario)}</td>
                  <td style={{ padding: '13px 16px', fontSize: 14, fontWeight: 700, color: C.accent, textAlign: 'right' }}>{fmtBRL(v.valor_total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
