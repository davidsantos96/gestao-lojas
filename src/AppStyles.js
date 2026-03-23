import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${props => props.theme.colors.bg};
  color: ${props => props.theme.colors.muted};
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 14px;
`

export const LoadingBox = styled.div`
  text-align: center;
`

export const LoadingIconWrap = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props => props.theme.colors.accent}18;
  border: 1px solid ${props => props.theme.colors.accent}30;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  animation: ${pulse} 1.5s ease-in-out infinite;
`

export const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid ${props => props.theme.colors.accent};
  border-top-color: transparent;
  animation: ${spin} 0.8s linear infinite;
`

export const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${props => props.theme.colors.bg};
  color: ${props => props.theme.colors.text};
  font-family: 'Inter', system-ui, sans-serif;
  position: relative;
`

export const SidebarOverlay = styled.div`
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  z-index: 49;
  
  @media (max-width: 767px) {
    display: block;
  }
`

export const MainArea = styled.main`
  flex: 1;
  overflow: auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
`

export const MainContent = styled.div`
  padding: 24px 20px;
  flex: 1;
  
  @media (max-width: 767px) {
    padding: 16px 12px;
  }
`
