import { C } from '../../constants/theme'
import { dreData } from '../../data/mock'
import { fmtBRL, fmtPct } from '../../utils/format'
import { Card } from '../../components/ui/Card'

const DRE_COLORS = {
  receita:  '#00d9a8',
  desconto: '#9299b0',
  subtotal: '#4f8fff',
  total:    '#00d9a8',
}

const METRICAS = [
  { label: 'Margem Bruta',   valor: 65.3, color: '#00d9a8' },
  { label: 'Margem Líquida', valor: 39.8, color: '#f7c948' },
]

export function DRE() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <Card style={{ padding: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 20 }}>
          DRE Simplificado — Março 2026
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {dreData.map((d, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: d.tipo === 'subtotal' || d.tipo === 'total' ? '12px 0' : '8px 0',
              borderTop: d.tipo === 'subtotal' || d.tipo === 'total' ? `1px solid ${C.border}` : 'none',
              marginTop: d.tipo === 'subtotal' || d.tipo === 'total' ? 4 : 0,
            }}>
              <span style={{
                fontSize: d.tipo === 'total' ? 14 : 13,
                fontWeight: d.tipo === 'subtotal' || d.tipo === 'total' ? 700 : 400,
                color: d.tipo === 'desconto' ? C.muted2 : C.text,
              }}>
                {d.label}
              </span>
              <span style={{
                fontSize: d.tipo === 'total' ? 16 : 13,
                fontWeight: d.tipo === 'subtotal' || d.tipo === 'total' ? 700 : 500,
                color: DRE_COLORS[d.tipo],
                fontFamily: 'monospace',
              }}>
                {d.valor < 0 ? `-${fmtBRL(Math.abs(d.valor))}` : fmtBRL(d.valor)}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {METRICAS.map(({ label, valor, color }) => (
          <Card key={label} style={{ padding: 24 }}>
            <div style={{ fontSize: 12, color: C.muted, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
              {label}
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color, marginBottom: 4 }}>
              {fmtPct(valor)}
            </div>
            <div style={{ height: 8, background: C.s3, borderRadius: 4 }}>
              <div style={{ width: `${valor}%`, height: '100%', background: color, borderRadius: 4 }} />
            </div>
          </Card>
        ))}

        <Card style={{ padding: 24 }}>
          <div style={{ fontSize: 12, color: C.muted, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
            Ticket Médio
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: C.blue }}>R$ 187</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>283 transações no mês</div>
        </Card>
      </div>
    </div>
  )
}
