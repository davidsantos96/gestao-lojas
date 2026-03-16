import { C } from '../../constants/theme'

export function Skeleton({ width = '100%', height = 16, radius = 6, style }) {
  return (
    <div style={{
      width,
      height,
      borderRadius: radius,
      background: `linear-gradient(90deg, ${C.s2} 25%, ${C.s3} 50%, ${C.s2} 75%)`,
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
      ...style,
    }} />
  )
}

export function SkeletonTable({ rows = 6, cols = 8 }) {
  return (
    <div style={{ padding: '0 0 8px' }}>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: 12,
          padding: '14px 16px',
          borderBottom: `1px solid ${C.border}`,
        }}>
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} height={14} width={j === 0 ? '60%' : j === cols - 1 ? '40%' : '80%'} />
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonKPI() {
  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: '20px 22px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    }}>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Skeleton width={80} height={11} />
        <Skeleton width={120} height={26} />
        <Skeleton width={90} height={12} />
      </div>
      <Skeleton width={38} height={38} radius={10} />
    </div>
  )
}
