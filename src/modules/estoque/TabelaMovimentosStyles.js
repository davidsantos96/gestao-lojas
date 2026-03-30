import styled from 'styled-components';
import { Card } from '../../components/ui/Card';

export const TableWrap = styled(Card)`
  padding: 0;
  overflow: hidden;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead tr {
    border-bottom: 1px solid ${props => props.theme.colors.border};
    background: ${props => props.theme.colors.s2};
  }

  tbody tr {
    border-bottom: 1px solid ${props => props.theme.colors.border};
    background: ${props => props.$isEven ? 'transparent' : props.theme.colors.s2};
    transition: background .12s;

    &:last-child {
      border-bottom: none;
    }
    &:hover {
      background: ${props => props.theme.colors.s3};
    }
  }
`;

export const Th = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 11px;
  color: ${props => props.theme.colors.muted2};
  font-family: monospace;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-weight: 700;
  white-space: nowrap;
`;

export const Tr = styled.tr``;

export const Td = styled.td`
  padding: 13px 16px;
  font-size: ${props => props.$fontSize || '12px'};
  font-family: ${props => props.$mono ? 'monospace' : 'inherit'};
  font-weight: ${props => props.$weight || 400};
  color: ${props => props.$color || props.theme.colors.text};
`;
