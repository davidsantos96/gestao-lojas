import styled from 'styled-components'

/* Cashflow Styles */
export const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`

export const ChartTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`

export const ChartLegend = styled.div`
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: ${props => props.theme.colors.muted};
`

export const LegendItem = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
`

export const LegendColor = styled.span`
  width: 10px;
  height: 3px;
  background: ${props => props.$color};
  display: inline-block;
  border-radius: 2px;
`

/* DRE Styles */
export const DreGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`

export const DreTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 20px;
`

export const DreList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`

export const DreLineStyle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.$isSubtotal || props.$isTotal ? '12px 0' : '8px 0'};
  border-top: ${props => props.$isSubtotal || props.$isTotal ? `1px solid ${props.theme.colors.border}` : 'none'};
  margin-top: ${props => props.$isSubtotal || props.$isTotal ? '4px' : '0'};
`

export const DreLineSkeleton = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-top: ${props => props.$borderTop ? `1px solid ${props.theme.colors.border}` : 'none'};
`

export const DreLabel = styled.span`
  font-size: ${props => props.$isTotal ? '14px' : '13px'};
  font-weight: ${props => props.$isSubtotal || props.$isTotal ? 700 : 400};
  color: ${props => props.$isDesconto ? props.theme.colors.muted2 : props.theme.colors.text};
`

export const DreValue = styled.span`
  font-size: ${props => props.$isTotal ? '16px' : '13px'};
  font-weight: ${props => props.$isSubtotal || props.$isTotal ? 700 : 500};
  color: ${props => props.$color || props.theme.colors.muted2};
  font-family: monospace;
`

export const MetricsCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const MetricLabel = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.muted2};
  font-family: monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
`

export const MetricValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.$color};
  margin-bottom: 6px;
`

export const ProgressBarBg = styled.div`
  height: 8px;
  background: ${props => props.theme.colors.s3};
  border-radius: 4px;
`

export const ProgressBarFill = styled.div`
  width: ${props => props.$pct}%;
  height: 100%;
  background: ${props => props.$color};
  border-radius: 4px;
  transition: width .4s;
`

export const MetricSub = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.muted};
  margin-top: 4px;
`
