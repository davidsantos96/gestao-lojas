import styled from 'styled-components'

export const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 20px;

  @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px)  { grid-template-columns: 1fr; }
`

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 16px;
  align-items: start;

  @media (max-width: 1000px) { grid-template-columns: 1fr; }
`

export const SectionTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${p => p.theme.colors.text};
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const LegendRow = styled.div`
  display: flex;
  gap: 14px;
  font-size: 12px;
  color: ${p => p.theme.colors.muted};
`

export const LegendDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${p => p.$color};
  display: inline-block;
  margin-right: 4px;
  flex-shrink: 0;
`

// ─── Alert Panel ──────────────────────────────────────────────────────────────

export const AlertItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid ${p => p.theme.colors.border};
  &:last-child { border-bottom: none; }
`

export const AlertIconWrap = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${p => p.$bg};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

export const AlertInfo = styled.div`
  flex: 1;
  min-width: 0;
`

export const AlertLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${p => p.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const AlertSub = styled.div`
  font-size: 11px;
  color: ${p => p.theme.colors.muted};
  margin-top: 2px;
`

export const AlertValue = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${p => p.$color || p.theme.colors.text};
  flex-shrink: 0;
  font-family: monospace;
`

export const EmptyAlerts = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 28px 0;
  gap: 8px;
  font-size: 13px;
  color: ${p => p.theme.colors.muted};
`

// ─── Delta badge ──────────────────────────────────────────────────────────────

export const DeltaBadge = styled.span`
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 99px;
  background: ${p => p.$positive ? 'rgba(0,217,168,.12)' : 'rgba(255,91,107,.12)'};
  color: ${p => p.$positive ? p.theme.colors.accent : p.theme.colors.red};
`
