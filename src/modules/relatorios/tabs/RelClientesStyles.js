import styled from 'styled-components'

export const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px)  { grid-template-columns: 1fr; }
`

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 900px) { grid-template-columns: 1fr; }
`

export const ChartCard = styled.div`
  background: ${p => p.theme.colors.card};
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
`

export const CardTitle = styled.h3`
  font-size: 13px;
  font-weight: 700;
  color: ${p => p.theme.colors.muted2};
  text-transform: uppercase;
  letter-spacing: .6px;
  margin: 0 0 18px;
`

export const TableCard = styled.div`
  background: ${p => p.theme.colors.card};
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  grid-column: 1 / -1;
`

export const TableWrap = styled.div`
  overflow-x: auto;
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
`

export const Th = styled.th`
  padding: 8px 12px;
  text-align: ${p => p.$right ? 'right' : 'left'};
  color: ${p => p.theme.colors.muted2};
  font-weight: 700;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .5px;
  border-bottom: 1px solid ${p => p.theme.colors.border};
  cursor: ${p => p.$sortable ? 'pointer' : 'default'};
  user-select: none;
  white-space: nowrap;

  &:hover { color: ${p => p.$sortable ? p.theme.colors.text : p.theme.colors.muted2}; }
`

export const Td = styled.td`
  padding: 10px 12px;
  color: ${p => p.theme.colors.text};
  text-align: ${p => p.$right ? 'right' : 'left'};
  border-bottom: 1px solid ${p => p.theme.colors.border};
  white-space: nowrap;
`

export const ScoreBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  background: ${p => p.$bg || 'rgba(79,143,255,.15)'};
  color: ${p => p.$color || '#4f8fff'};
`

export const LtvBar = styled.div`
  position: relative;
  height: 6px;
  border-radius: 3px;
  background: ${p => p.theme.colors.border};
  width: 80px;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    left: 0; top: 0;
    height: 100%;
    width: ${p => Math.min(100, p.$pct || 0)}%;
    border-radius: 3px;
    background: ${p => p.$color || '#4f8fff'};
    transition: width .4s;
  }
`

export const SortArrow = styled.span`
  margin-left: 4px;
  opacity: ${p => p.$active ? 1 : 0.3};
`

export const DonutCenter = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;

  strong { display: block; font-size: 22px; font-weight: 700; color: ${p => p.theme.colors.text}; }
  span   { font-size: 11px; color: ${p => p.theme.colors.muted}; }
`

export const DonutWrap = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`

export const Legend = styled.ul`
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px 20px;
  justify-content: center;
`

export const LegendItem = styled.li`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${p => p.theme.colors.muted};
`

export const LegendDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${p => p.$color};
  flex-shrink: 0;
`
