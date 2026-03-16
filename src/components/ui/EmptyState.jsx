import { C } from '../../constants/theme'

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '48px 24px', gap: 12, textAlign: 'center',
    }}>
      {Icon && (
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: C.s2, border: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={22} color={C.muted} />
        </div>
      )}
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>{title}</div>
        {description && (
          <div style={{ fontSize: 12, color: C.muted, maxWidth: 300 }}>{description}</div>
        )}
      </div>
      {action}
    </div>
  )
}
