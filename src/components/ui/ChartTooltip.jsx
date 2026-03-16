import { C } from '../../constants/theme'
import { fmtBRL } from '../../utils/format'

export function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div style={{
      background: C.s3, border: `1px solid ${C.border}`,
      borderRadius: 8, padding: '10px 14px', fontSize: 12,
    }}>
      <div style={{ color: C.muted, marginBottom: 6, fontFamily: 'monospace' }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color, display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: p.color, display: 'inline-block' }} />
          {fmtBRL(p.value)}
        </div>
      ))}
    </div>
  )
}
