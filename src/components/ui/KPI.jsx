import { C } from '../../constants/theme'
import { Card } from './Card'

export function KPI({ label, value, sub, color, icon: Icon }) {
  return (
    <Card style={{ padding: '20px 22px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        <div style={{
          fontSize: 11, color: C.muted, letterSpacing: 1,
          textTransform: 'uppercase', marginBottom: 8, fontFamily: 'monospace',
        }}>
          {label}
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, color: color || C.text, letterSpacing: -1 }}>
          {value}
        </div>
        {sub && (
          <div style={{ fontSize: 12, color: C.muted2, marginTop: 4 }}>{sub}</div>
        )}
      </div>
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: `${color || C.accent}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={18} color={color || C.accent} />
      </div>
    </Card>
  )
}
