import styled, { keyframes, css } from 'styled-components'

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

export const DashboardHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 28px;
`

export const DashboardTitleWrap = styled.div``

export const DashboardModule = styled.div`
  font-size: 11px;
  color: ${props => props.theme.colors.accent};
  font-family: monospace;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 6px;
`

export const DashboardTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  letter-spacing: -0.5px;
`

export const RefreshBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  border-radius: 8px;
  background: ${props => props.theme.colors.s2};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.disabled ? props.theme.colors.muted : props.theme.colors.muted2};
  font-size: 12px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all .15s;

  svg {
    ${props => props.$loading && css`
      animation: ${spin} 0.8s linear infinite;
    `}
  }
`

export const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 24px;
`

export const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.$template || '1fr 1fr'};
  gap: 16px;
  margin-bottom: ${props => props.$mb || '0'};
`

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.$mb || '20px'};
`

export const CardTitle = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`

export const SeeAllBtn = styled.button`
  font-size: 11px;
  color: ${props => props.theme.colors.blue};
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
`

export const ListWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const ListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`

export const MovIconWrap = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => 
    props.$tipo === 'entrada' ? 'rgba(0,217,168,.12)' : 
    props.$tipo === 'saida' ? 'rgba(255,91,107,.12)' : 
    'rgba(247,201,72,.12)'};
`

export const ListInfo = styled.div`
  flex: 1;
  min-width: 0;
`

export const ListTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const ListSub = styled.div`
  font-size: 11px;
  color: ${props => props.theme.colors.muted};
  margin-top: 1px;
`

export const ListDate = styled.div`
  font-size: 11px;
  color: ${props => props.theme.colors.muted};
  flex-shrink: 0;
`

export const FinValueItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`

export const FinValue = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${props => props.$color};
`

/* Painel de Alertas specifics */

export const AlertsCentralHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
`

export const AlertsTitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const AlertsCentralTitle = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`

export const AlertsBadge = styled.span`
  font-size: 10px;
  font-family: monospace;
  padding: 2px 8px;
  border-radius: 99px;
  background: rgba(255,91,107,.15);
  color: ${props => props.theme.colors.red};
  border: 1px solid rgba(255,91,107,.3);
  font-weight: 700;
`

export const AlertsSuccess = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${props => props.theme.colors.accent};
`

export const EmptyAlerts = styled.div`
  text-align: center;
  padding: 20px 0;
  color: ${props => props.theme.colors.muted};
  font-size: 12px;
`

export const SectionWrap = styled.div`
  margin-bottom: 4px;
`

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`

export const SectionTitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const SectionIconBox = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: ${props => props.$cor}18;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const SectionTitle = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`

export const SectionCount = styled.span`
  font-size: 10px;
  font-family: monospace;
  padding: 1px 7px;
  border-radius: 99px;
  background: ${props => props.$cor}18;
  color: ${props => props.$cor};
  border: 1px solid ${props => props.$cor}33;
`

export const AlertaCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 12px;
  border-radius: 8px;
  background: ${props => props.theme.colors.s2};
  border: 1px solid ${props => props.theme.colors.border};
  border-left: 3px solid ${props => props.$cor};
`

export const AlertaRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  margin-left: 8px;
`

export const AlertaValue = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${props => props.$cor};
`

export const Divider = styled.div`
  height: 1px;
  background: ${props => props.theme.colors.border};
  margin: 14px 0;
`
