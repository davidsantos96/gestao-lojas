import styled from 'styled-components'

export const FichaLayout = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
  
  @media (max-width: 991px) {
    grid-template-columns: 1fr;
  }
`

export const Card = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  
  h3 {
    font-size: 16px;
    margin: 0 0 16px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`

export const DataItem = styled.div`
  margin-bottom: 12px;
  
  label {
    display: block;
    font-size: 11px;
    color: ${props => props.theme.colors.muted};
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  
  span {
    font-size: 14px;
    font-weight: 500;
  }
`

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`

export const ActionHeader = styled.div`
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 20px;
`

export const ClientTitleArea = styled.div`
  h2 { margin: 0; font-size: 24px; }
`

export const BackButton = styled.button`
  padding: 8px 16px; 
  background: transparent; 
  border: 1px solid ${props => props.theme.colors.border}; 
  color: ${props => props.theme.colors.muted}; 
  border-radius: 8px; 
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.theme.colors.s2};
    color: ${props => props.theme.colors.text};
  }
`

export const NotesTextarea = styled.textarea`
  width: 100%; 
  background: ${props => props.theme.colors.bg}; 
  border: 1px solid ${props => props.theme.colors.border}; 
  padding: 10px; 
  border-radius: 8px; 
  color: ${props => props.theme.colors.text}; 
  min-height: 120px;
  resize: vertical;
  outline: none;
  
  &:focus {
    border-color: ${props => props.theme.colors.accent};
  }
`
