import styled from 'styled-components'

export const TableWrap = styled.div`
  width: 100%;
  border-collapse: collapse;
`

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead tr {
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
`

export const SectionWrap = styled.div`
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid ${props => props.theme.colors.border};
`

export const SectionHeader = styled.p`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${props => props.theme.colors.muted};
  font-family: monospace;
  margin-bottom: 14px;

  span {
    font-weight: 400;
    letter-spacing: 0;
    text-transform: none;
    margin-left: 6px;
    color: ${props => props.theme.colors.muted2};
  }
`

export const DeleteBtn = styled.button`
  padding: 5px 7px;
  border-radius: 6px;
  cursor: pointer;
  transition: all .15s;
  background: ${props => props.$confirming ? 'rgba(255,91,107,.15)' : props.theme.colors.s2};
  border: 1px solid ${props => props.$confirming ? props.theme.colors.red : 'rgba(255,91,107,.3)'};
  display: flex;
  align-items: center;
  gap: ${props => props.$confirming ? '4px' : '0'};

  span {
    font-size: 10px;
    color: ${props => props.theme.colors.red};
    font-weight: 600;
  }

  &:hover {
    filter: brightness(1.2);
  }
`

export const Th = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 11px;
  color: ${props => props.theme.colors.muted};
  font-family: monospace;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-weight: 500;
  white-space: nowrap;
`

export const Tr = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.$isEven ? 'transparent' : 'rgba(255,255,255,.015)'};
`

export const Td = styled.td`
  padding: 13px 16px;
  font-size: ${props => props.$fontSize || '13px'};
  font-weight: ${props => props.$weight || 400};
  color: ${props => props.$color || props.theme.colors.text};
  font-family: ${props => props.$mono ? 'monospace' : 'inherit'};
`

export const TableFooter = styled.div`
  padding: 14px 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: flex-end;
`

export const TotalText = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.muted};
`

export const TotalValue = styled.strong`
  color: ${props => props.$color};
  margin-left: 6px;
`

export const ActionButton = styled.button`
  padding: 5px 12px;
  background: ${props => props.$bg};
  border: 1px solid ${props => props.$border};
  border-radius: 6px;
  color: ${props => props.$color};
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all .15s;

  &:hover {
    opacity: 0.8;
  }
`

export const AttachmentBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid ${props => props.$hasAnexos ? props.theme.colors.blue + '55' : props.theme.colors.border};
  background: ${props => props.$hasAnexos ? 'rgba(79,143,255,.08)' : props.theme.colors.s2};
  color: ${props => props.$hasAnexos ? props.theme.colors.blue : props.theme.colors.muted};
  font-size: 11px;
  font-weight: 600;
  transition: all .15s;

  &:hover {
    filter: brightness(1.2);
  }
`

export const IconBtnWrap = styled.div`
  display: flex;
  gap: 8px;
`

export const IconBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$color || props.theme.colors.muted2};
  transition: all .15s;

  &:hover {
    background: ${props => props.theme.colors.s2};
    color: ${props => props.$hoverColor || props.theme.colors.text};
  }
`
