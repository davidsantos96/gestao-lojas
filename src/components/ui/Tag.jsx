export function Tag({ children, color, bg }) {
  return (
    <span style={{
      fontSize: 11, fontFamily: 'monospace', fontWeight: 600,
      padding: '3px 9px', borderRadius: 99,
      background: bg, color, border: `1px solid ${color}33`,
      letterSpacing: 0.3, whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  )
}
