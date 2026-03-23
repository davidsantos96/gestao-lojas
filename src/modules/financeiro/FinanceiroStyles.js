import styled, { keyframes, css } from 'styled-components'

export const Container = styled.div`
`

export const HeaderWrap = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 24px;
`

export const HeaderLeft = styled.div``

export const ModuleBadge = styled.div`
  font-size: 11px;
  color: ${props => props.theme.colors.blue};
  font-family: monospace;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 6px;
`

export const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  letter-spacing: -0.5px;
  margin: 0;
`

export const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
`

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

export const RefreshBtn = styled.button`
  padding: 9px 12px;
  border-radius: 8px;
  background: ${props => props.theme.colors.s2};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.$refreshing ? props.theme.colors.muted : props.theme.colors.muted2};
  cursor: ${props => props.$refreshing ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  transition: all .15s;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.s3};
    color: ${props => props.theme.colors.text};
  }

  svg {
    animation: ${props => props.$refreshing ? css`${spin} 0.8s linear infinite` : 'none'};
  }
`

export const CtaBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border-radius: 8px;
  background: ${props => props.theme.colors.blue};
  border: none;
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: opacity .15s;

  &:hover {
    opacity: 0.85;
  }
`

export const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 24px;
`

export const TabsWrap = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`

export const TabBtn = styled.button`
  padding: 10px 18px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.$active ? props.theme.colors.blue : props.theme.colors.muted};
  border-bottom: ${props => props.$active ? `2px solid ${props.theme.colors.blue}` : '2px solid transparent'};
  margin-bottom: -1px;
  transition: all .15s;

  &:hover {
    color: ${props => props.$active ? props.theme.colors.blue : props.theme.colors.text};
  }
`
