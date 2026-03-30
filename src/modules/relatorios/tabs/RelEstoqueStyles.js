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
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 900px) { grid-template-columns: 1fr; }
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

export const SubLabel = styled.span`
  font-size: 11px;
  font-weight: 400;
  color: ${p => p.theme.colors.muted};
`

// ─── Table shared ─────────────────────────────────────────────────────────────

export const TableWrap = styled.div`
  overflow-x: auto;
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
`

export const Th = styled.th`
  text-align: ${p => p.$right ? 'right' : 'left'};
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 700;
  color: ${p => p.theme.colors.muted2};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid ${p => p.theme.colors.border};
  white-space: nowrap;
`

export const Td = styled.td`
  padding: 11px 12px;
  color: ${p => p.theme.colors.text};
  border-bottom: 1px solid ${p => p.theme.colors.border};
  text-align: ${p => p.$right ? 'right' : 'left'};
  white-space: nowrap;
  &:first-child { padding-left: 16px; }
  &:last-child  { padding-right: 16px; }
`

export const Tr = styled.tr`
  transition: background .1s;
  &:last-child td { border-bottom: none; }
  &:hover td { background: ${p => p.theme.colors.s2}; }
`

export const ProductName = styled.div`
  font-weight: 600;
  font-size: 12px;
  color: ${p => p.theme.colors.text};
`

export const ProductSku = styled.div`
  font-size: 10px;
  font-family: monospace;
  color: ${p => p.theme.colors.muted};
  margin-top: 2px;
`

// ─── ABC Bar ──────────────────────────────────────────────────────────────────

export const AbcBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
`

export const AbcTrack = styled.div`
  width: 64px;
  height: 4px;
  border-radius: 2px;
  background: ${p => p.theme.colors.border};
  overflow: hidden;
`

export const AbcFill = styled.div`
  height: 100%;
  border-radius: 2px;
  width: ${p => p.$pct}%;
  background: ${p => p.$class === 'A'
    ? p.theme.colors.accent
    : p.$class === 'B'
    ? p.theme.colors.yellow
    : p.theme.colors.muted};
`

// ─── Dead stock badge ─────────────────────────────────────────────────────────

export const DaysBadge = styled.span`
  font-size: 11px;
  font-family: monospace;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 99px;
  background: ${p =>
    p.$days > 60 ? 'rgba(255,91,107,.12)' :
    p.$days > 30 ? 'rgba(247,201,72,.12)' :
    'rgba(107,115,143,.1)'};
  color: ${p =>
    p.$days > 60 ? p.theme.colors.red :
    p.$days > 30 ? p.theme.colors.yellow :
    p.theme.colors.muted};
`

// ─── Legend ───────────────────────────────────────────────────────────────────

export const LegendRow = styled.div`
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: ${p => p.theme.colors.muted};
  flex-wrap: wrap;
`

export const LegendDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${p => p.$color};
  display: inline-block;
  margin-right: 4px;
`
