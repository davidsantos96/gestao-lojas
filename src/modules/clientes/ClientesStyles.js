import styled from 'styled-components'
import { Card } from '../../components/ui/Card'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const KPIHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
`

export const TableWrap = styled(Card)`
  padding: 0;
  overflow: hidden;
`

export const SearchCard = styled(Card)`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
`

export const SearchInput = styled.input`
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: ${props => props.theme.colors.text};
  font-size: 13px;
  
  &::placeholder {
    color: ${props => props.theme.colors.muted};
  }
`

export const FilterSelect = styled.select`
  background: ${props => props.theme.colors.s2};
  border: 1px solid ${props => props.theme.colors.border};
  padding: 10px 16px;
  border-radius: 9px;
  color: ${props => props.theme.colors.text};
  font-size: 13px;
  outline: none;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 180px;
  
  &:focus {
    border-color: ${props => props.theme.colors.accent};
    background: ${props => props.theme.colors.s3};
  }

  option {
    background: ${props => props.theme.colors.s2};
    color: ${props => props.theme.colors.text};
  }
`

export const PrimaryButton = styled.button`
  padding: 10px 20px;
  background: ${props => props.theme.colors.accent};
  color: #051a12;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.9;
  }
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  thead tr {
    background: ${props => props.theme.colors.s2};
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
  
  th {
    padding: 12px 16px;
    text-align: left;
    font-size: 11px;
    color: ${props => props.theme.colors.muted2};
    font-family: monospace;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    font-weight: 700;
  }
  
  td {
    padding: 14px 16px;
    font-size: 13px;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  tr:hover {
    background: ${props => props.theme.colors.s3};
    cursor: pointer;
  }
`

export const ValueText = styled.span`
  font-family: monospace;
  font-weight: 700;
  font-size: 15px;
  color: ${props => props.theme.colors.accent};
  letter-spacing: -0.5px;
`

export const DateText = styled.span`
  font-family: monospace;
  font-size: 11px;
  color: ${props => props.theme.colors.muted};
`

export const SegmentBadge = styled.span`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  background: ${props => {
    switch (props.type) {
      case 'VIP': return '#FFD70018';
      case 'Inativo': return '#FF4B4B18';
      default: return '#10B98118';
    }
  }};
  
  color: ${props => {
    switch (props.type) {
      case 'VIP': return '#FFD700';
      case 'Inativo': return '#FF4B4B';
      default: return '#10B981';
    }
  }};
  
  border: 1px solid ${props => {
    switch (props.type) {
      case 'VIP': return '#FFD70030';
      case 'Inativo': return '#FF4B4B30';
      default: return '#10B98130';
    }
  }};
`

export const EmptyState = styled.div`
  padding: 48px;
  text-align: center;
  color: ${props => props.theme.colors.muted};
  font-size: 13px;
`
