import { Eye, Edit2, Trash2, Package } from 'lucide-react'
import { C } from '../../constants/theme'
import { STATUS_ESTOQUE } from '../../data/mock'
import { fmtBRL } from '../../utils/format'
import { Card } from '../../components/ui/Card'
import { Tag } from '../../components/ui/Tag'
import { EmptyState } from '../../components/ui/EmptyState'
import { SkeletonTable } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'

const COR_HEX = {
  'Preto':'#1a1a1a','Branco':'#f5f5f5','Cinza':'#9e9e9e','Azul':'#1565c0',
  'Azul Claro':'#64b5f6','Vermelho':'#c62828','Rosa':'#e91e63','Verde':'#2e7d32',
  'Amarelo':'#f9a825','Laranja':'#e65100','Roxo':'#6a1b9a','Marrom':'#4e342e',
  'Bege':'#d7ccc8','Vinho':'#880e4f',
}

const COLUNAS = ['Código', 'Produto', 'Categoria', 'Cor', 'Estoque', 'Mínimo', 'Custo', 'Preço', 'Status', '']

export function TabelaProdutos({ produtos, loading, error, onRefetch, onEditar, onRemover }) {
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
    <Card style={{ overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${C.border}` }}>
            {COLUNAS.map((h, i) => (
              <th key={i} style={{
                padding: '12px 16px', textAlign: 'left', fontSize: 11,
                color: C.muted, fontFamily: 'monospace', letterSpacing: 1.5,
                textTransform: 'uppercase', fontWeight: 500, whiteSpace: 'nowrap',
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {produtos.map((p, i) => {
            const cfg = STATUS_ESTOQUE[p.status] ?? STATUS_ESTOQUE.ok
            const pct = Math.min(100, Math.round((p.estoque / (p.minimo * 3)) * 100))
            return (
              <tr key={p.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.015)', transition: 'background .1s' }}>
                <td style={{ padding: '13px 16px', fontSize: 12, color: C.muted, fontFamily: 'monospace' }}>{p.sku}</td>
                <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 600, color: C.text }}>{p.nome}</td>
                <td style={{ padding: '13px 16px', fontSize: 12, color: C.muted2 }}>{p.categoria}</td>
                <td style={{ padding: '13px 16px' }}>
                  {p.cor
                    ? <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 12, height: 12, borderRadius: '50%', background: COR_HEX[p.cor] || '#888', flexShrink: 0, border: p.cor === 'Branco' ? '1px solid #444' : 'none' }} />
                        <span style={{ fontSize: 12, color: C.muted2 }}>{p.cor}</span>
                      </div>
                    : <span style={{ fontSize: 12, color: C.border }}>—</span>
                  }
                </td>
                <td style={{ padding: '13px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: cfg.color, minWidth: 28 }}>{p.estoque}</span>
                    <div style={{ width: 60, height: 4, borderRadius: 2, background: C.s3 }}>
                      <div style={{ width: `${pct}%`, height: '100%', borderRadius: 2, background: cfg.color, transition: 'width .3s' }} />
                    </div>
                  </div>
                </td>
                <td style={{ padding: '13px 16px', fontSize: 12, color: C.muted }}>{p.minimo}</td>
                <td style={{ padding: '13px 16px', fontSize: 12, color: C.muted2 }}>{fmtBRL(p.custo)}</td>
                <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 600, color: C.text }}>{fmtBRL(p.preco)}</td>
                <td style={{ padding: '13px 16px' }}><Tag color={cfg.color} bg={cfg.bg}>{cfg.label}</Tag></td>
                <td style={{ padding: '13px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button title="Ver" style={{ padding: '5px 7px', background: C.s2, border: `1px solid ${C.border}`, borderRadius: 6, cursor: 'pointer' }}>
                      <Eye size={13} color={C.muted2} />
                    </button>
                    <button title="Editar" onClick={() => onEditar?.(p)} style={{ padding: '5px 7px', background: C.s2, border: `1px solid ${C.border}`, borderRadius: 6, cursor: 'pointer' }}>
                      <Edit2 size={13} color={C.muted2} />
                    </button>
                    <button title="Remover" onClick={() => onRemover?.(p)} style={{ padding: '5px 7px', background: C.s2, border: `1px solid rgba(255,91,107,.3)`, borderRadius: 6, cursor: 'pointer' }}>
                      <Trash2 size={13} color={C.red} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Card>
  )
}
