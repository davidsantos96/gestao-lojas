import { useState } from 'react'
import { ShoppingCart, Search, Filter } from 'lucide-react'
import { C } from '../../constants/theme'
import { fmtBRL } from '../../utils/format'
import { useVendas } from '../../hooks/useVendas'
import { Card } from '../../components/ui/Card'
import { SkeletonTable } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { EmptyState } from '../../components/ui/EmptyState'

export function Vendas() {
  const [busca, setBusca] = useState('')

  const { vendas, loading, error, refetch } = useVendas()

  if (loading) return <div><SkeletonTable rows={8} cols={7} /></div>
  if (error) return <ErrorState error={error} onRetry={refetch} />

  const filtradas = vendas.filter(v =>
    v.produto_nome.toLowerCase().includes(busca.toLowerCase()) ||
    v.produto_sku.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: C.accent, fontFamily: 'monospace', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>Módulo</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, letterSpacing: -0.5 }}>Controle de Vendas</h2>
        </div>
      </div>

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
