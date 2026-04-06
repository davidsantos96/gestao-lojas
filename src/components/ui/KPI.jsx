import { C } from '../../constants/theme'
import { Card } from './Card'

export function KPI({ label, value, sub, sub2, color, icon: Icon }) {
  const hasValue = value !== null && value !== undefined
  return (
    <Card style={{ padding: '20px 22px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        <div style={{
          fontSize: 11, color: C.muted, letterSpacing: 1,
          textTransform: 'uppercase', marginBottom: 8, fontFamily: 'monospace',
        }}>
          {label}
        </div>
        {hasValue && (
          <div style={{ fontSize: 26, fontWeight: 700, color: color || C.text, letterSpacing: -1 }}>
            {value}
          </div>
        )}
        {sub && (
          <div style={{ fontSize: hasValue ? 12 : 16, fontWeight: hasValue ? 400 : 600, color: hasValue ? C.muted2 : (color || C.text), marginTop: hasValue ? 4 : 0 }}>{sub}</div>
        )}
        {sub2 && (
          <div style={{ fontSize: hasValue ? 12 : 16, fontWeight: hasValue ? 400 : 600, color: hasValue ? C.muted2 : (color || C.text), marginTop: 4 }}>{sub2}</div>
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
