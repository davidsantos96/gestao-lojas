import styled from 'styled-components'

export const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px)  { grid-template-columns: 1fr; }
`

export const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: ${p => p.$cols || '1fr 1fr'};
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

export const DreTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
`

export const DreTr = styled.tr`
  background: ${p => {
    if (p.$tipo === 'total')    return 'rgba(0,217,168,.06)'
    if (p.$tipo === 'subtotal') return 'rgba(79,143,255,.04)'
    return 'transparent'
  }};
  border-bottom: ${p => p.$tipo === 'total' ? '2px solid' : '1px solid'} ${p => p.theme.colors.border};
`

export const DreTd = styled.td`
  padding: 10px 14px;
  color: ${p => {
    if (p.$tipo === 'total')    return '#00d9a8'
    if (p.$tipo === 'subtotal') return p.theme.colors.accent
    if (p.$valor < 0)           return '#ff5b6b'
    return p.theme.colors.text
  }};
  font-weight: ${p => (p.$tipo === 'total' || p.$tipo === 'subtotal') ? 700 : 400};
  text-align: ${p => p.$right ? 'right' : 'left'};
  font-size: ${p => p.$tipo === 'total' ? '14px' : '13px'};
`

export const ProjectedDot = styled.circle`
  fill: none;
  stroke: ${p => p.$color};
  stroke-width: 2;
  stroke-dasharray: 4;
`

export const InadimLegend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
`

export const InadimRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: ${p => p.theme.colors.text};
`

export const InadimBar = styled.div`
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: ${p => p.theme.colors.border};
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    left: 0; top: 0;
    height: 100%;
    width: ${p => Math.min(100, p.$pct || 0)}%;
    border-radius: 4px;
    background: ${p => p.$color || '#ff5b6b'};
    transition: width .4s;
  }
`

export const InadimLabel = styled.span`
  min-width: 130px;
  color: ${p => p.theme.colors.muted};
  font-size: 12px;
`

export const InadimValue = styled.span`
  min-width: 54px;
  text-align: right;
  font-weight: 600;
  color: ${p => p.$warn ? '#ff5b6b' : p.theme.colors.text};
`
