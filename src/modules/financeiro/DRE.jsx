import { C } from '../../constants/theme'
import { fmtBRL, fmtPct } from '../../utils/format'
import { Card } from '../../components/ui/Card'
import { SkeletonKPI, Skeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'

const DRE_COLORS = {
  receita:  '#00d9a8',
  desconto: '#9299b0',
  subtotal: '#4f8fff',
  total:    '#00d9a8',
}

export function DRE({ data, loading, error, onRefetch }) {
  if (error) return <ErrorState error={error} onRetry={onRefetch} />

  const linhas   = data?.linhas            ?? []
  const metricas = [
    { label: 'Margem Bruta',   valor: data?.margem_bruta,    color: C.accent },
    { label: 'Margem Líquida', valor: data?.margem_liquida,  color: C.yellow },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {/* DRE table */}
      <Card style={{ padding: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 20 }}>
          DRE Simplificado — Março 2026
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {loading
            ? Array.from({ length: 9 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: i > 0 && i % 3 === 0 ? `1px solid ${C.border}` : 'none' }}>
                  <Skeleton width="55%" height={13} />
                  <Skeleton width="25%" height={13} />
                </div>
              ))
            : linhas.map((d, i) => (
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
                    color: DRE_COLORS[d.tipo] ?? C.muted2,
                    fontFamily: 'monospace',
                  }}>
                    {d.valor < 0 ? `-${fmtBRL(Math.abs(d.valor))}` : fmtBRL(d.valor)}
                  </span>
                </div>
              ))
          }
        </div>
      </Card>

      {/* Métricas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {metricas.map(({ label, valor, color }) => (
          loading
            ? <SkeletonKPI key={label} />
            : (
              <Card key={label} style={{ padding: 24 }}>
                <div style={{ fontSize: 12, color: C.muted, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                  {label}
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, color, marginBottom: 6 }}>
                  {fmtPct(valor ?? 0)}
                </div>
                <div style={{ height: 8, background: C.s3, borderRadius: 4 }}>
                  <div style={{ width: `${Math.min(valor ?? 0, 100)}%`, height: '100%', background: color, borderRadius: 4, transition: 'width .4s' }} />
                </div>
              </Card>
            )
        ))}

        <Card style={{ padding: 24 }}>
          <div style={{ fontSize: 12, color: C.muted, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
            Ticket Médio
          </div>
          {loading
            ? <Skeleton width="60%" height={32} />
            : <>
                <div style={{ fontSize: 32, fontWeight: 700, color: C.blue }}>{fmtBRL(data?.ticket_medio ?? 0)}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{data?.total_transacoes ?? 0} transações no mês</div>
              </>
          }
        </Card>
      </div>
    </div>
  )
}
