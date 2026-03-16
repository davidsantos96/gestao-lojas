import { Eye, Edit2 } from 'lucide-react'
import { C } from '../../constants/theme'
import { STATUS_ESTOQUE } from '../../data/mock'
import { fmtBRL } from '../../utils/format'
import { Card } from '../../components/ui/Card'
import { Tag } from '../../components/ui/Tag'

export function TabelaProdutos({ produtos }) {
  return (
    <Card style={{ overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${C.border}` }}>
            {['SKU', 'Produto', 'Categoria', 'Estoque', 'Mínimo', 'Custo', 'Preço', 'Status', ''].map((h, i) => (
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
            const cfg = STATUS_ESTOQUE[p.status]
            const pct = Math.min(100, Math.round((p.estoque / (p.minimo * 3)) * 100))
            return (
              <tr key={p.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.015)' }}>
                <td style={{ padding: '13px 16px', fontSize: 12, color: C.muted, fontFamily: 'monospace' }}>{p.sku}</td>
                <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 600, color: C.text }}>{p.nome}</td>
                <td style={{ padding: '13px 16px', fontSize: 12, color: C.muted2 }}>{p.categoria}</td>
                <td style={{ padding: '13px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: cfg.color, minWidth: 24 }}>{p.estoque}</span>
                    <div style={{ width: 60, height: 4, borderRadius: 2, background: C.s3 }}>
                      <div style={{ width: `${pct}%`, height: '100%', borderRadius: 2, background: cfg.color }} />
                    </div>
                  </div>
                </td>
                <td style={{ padding: '13px 16px', fontSize: 12, color: C.muted }}>{p.minimo}</td>
                <td style={{ padding: '13px 16px', fontSize: 12, color: C.muted2 }}>{fmtBRL(p.custo)}</td>
                <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 600, color: C.text }}>{fmtBRL(p.preco)}</td>
                <td style={{ padding: '13px 16px' }}><Tag color={cfg.color} bg={cfg.bg}>{cfg.label}</Tag></td>
                <td style={{ padding: '13px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button style={{ padding: '5px 7px', background: C.s2, border: `1px solid ${C.border}`, borderRadius: 6, cursor: 'pointer' }}>
                      <Eye size={13} color={C.muted2} />
                    </button>
                    <button style={{ padding: '5px 7px', background: C.s2, border: `1px solid ${C.border}`, borderRadius: 6, cursor: 'pointer' }}>
                      <Edit2 size={13} color={C.muted2} />
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
