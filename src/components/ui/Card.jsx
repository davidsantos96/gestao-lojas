import { C } from '../../constants/theme'

export function Card({ children, style, className }) {
  return (
    <div 
      className={className}
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
