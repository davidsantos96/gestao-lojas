import { C } from '../../constants/theme'

export function Card({ children, style }) {
  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      ...style,
    }}>
      {children}
    </div>
  )
}
