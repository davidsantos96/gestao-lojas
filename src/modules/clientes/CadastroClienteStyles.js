import styled from 'styled-components'

export const Container = styled.div`
  max-width: 800px; 
  margin: 0 auto;
`

export const Header = styled.div`
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 20px;
  
  h2 { margin: 0; font-size: 20px; }
`

export const FormCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;
`

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  label {
    font-size: 13px;
    font-weight: 600;
    color: ${props => props.theme.colors.muted};
  }
  
  input, select, textarea {
    background: ${props => props.theme.colors.bg};
    border: 1px solid ${props => props.theme.colors.border};
    padding: 10px 14px;
    border-radius: 8px;
    color: ${props => props.theme.colors.text};
    font-size: 14px;
    outline: none;
    transition: all 0.2s;
    
    &:focus {
      border-color: ${props => props.theme.colors.accent};
    }
  }
  
  textarea {
    resize: vertical;
    min-height: 100px;
  }
`

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
`

export const ActionButton = styled.button`
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  
  &.primary {
    background: ${props => props.theme.colors.accent};
    color: #051a12;
    border: none;
  }
  
  &.secondary {
    background: transparent;
    color: ${props => props.theme.colors.muted};
    border: 1px solid ${props => props.theme.colors.border};
  }
  
  &:hover {
    opacity: 0.9;
  }
`
