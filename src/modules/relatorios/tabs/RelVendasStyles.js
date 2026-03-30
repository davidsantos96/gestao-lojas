import styled from 'styled-components'

export const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 900px) { grid-template-columns: 1fr; }
`

export const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 20px;

  @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px)  { grid-template-columns: 1fr; }
`

export const SectionTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${p => p.theme.colors.text};
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const SubTitle = styled.div`
  font-size: 11px;
  color: ${p => p.theme.colors.muted};
  margin-top: 2px;
`

export const LegendRow = styled.div`
  display: flex;
  gap: 14px;
  font-size: 12px;
  color: ${p => p.theme.colors.muted};
  margin-left: auto;
`

export const LegendDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${p => p.$color};
  display: inline-block;
  margin-right: 4px;
`

// ─── Ranking Table ─────────────────────────────────────────────────────────

export const TableWrap = styled.div`
  overflow-x: auto;
  margin-top: 4px;
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
  cursor: ${p => p.$sortable ? 'pointer' : 'default'};
  user-select: none;

  &:hover {
    color: ${p => p.$sortable ? p.theme.colors.text : p.theme.colors.muted2};
  }
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

export const RankBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  font-family: monospace;
  background: ${p => {
    if (p.$pos === 1) return 'rgba(247,201,72,.18)'
    if (p.$pos === 2) return 'rgba(180,120,255,.14)'
    if (p.$pos === 3) return 'rgba(79,143,255,.14)'
    return p.theme.colors.s3
  }};
  color: ${p => {
    if (p.$pos === 1) return p.theme.colors.yellow
    if (p.$pos === 2) return p.theme.colors.purple
    if (p.$pos === 3) return p.theme.colors.blue
    return p.theme.colors.muted
  }};
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

export const SortArrow = styled.span`
  margin-left: 4px;
  opacity: ${p => p.$active ? 1 : 0.3};
`

export const MargemBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
`

export const MargemTrack = styled.div`
  width: 60px;
  height: 4px;
  border-radius: 2px;
  background: ${p => p.theme.colors.border};
  overflow: hidden;
`

export const MargemFill = styled.div`
  height: 100%;
  border-radius: 2px;
  width: ${p => p.$pct}%;
  background: ${p =>
    p.$pct >= 60 ? p.theme.colors.accent :
    p.$pct >= 40 ? p.theme.colors.yellow :
    p.theme.colors.red
  };
`
