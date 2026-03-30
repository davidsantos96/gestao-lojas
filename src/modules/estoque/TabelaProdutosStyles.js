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

export const ColorWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const ColorBadge = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.$hex || '#888'};
  flex-shrink: 0;
  border: ${props => props.$colorName === 'Branco' ? '1px solid #444' : 'none'};
`;

export const ColorName = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.muted2};
`;

export const EmptyColor = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.border};
`;

export const StockWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const StockNumber = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${props => props.$color};
  min-width: 28px;
`;

export const StockBarBg = styled.div`
  width: 60px;
  height: 4px;
  border-radius: 2px;
  background: ${props => props.theme.colors.s3};
  overflow: hidden;
`;

export const StockBarFill = styled.div`
  width: ${props => props.$pct}%;
  height: 100%;
  border-radius: 2px;
  background: ${props => props.$color};
  transition: width .3s;
`;

export const ActionsWrap = styled.div`
  display: flex;
  gap: 6px;
`;

export const ActionBtn = styled.button`
  padding: 5px 7px;
  background: ${props => props.theme.colors.s2};
  border: 1px solid ${props => props.$danger ? `${props.theme.colors.red}40` : props.theme.colors.border};
  border-radius: 6px;
  cursor: pointer;
  transition: all .15s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.$danger ? `${props.theme.colors.red}20` : props.theme.colors.s3};
    border-color: ${props => props.$danger ? props.theme.colors.red : props.theme.colors.muted};
  }
`;
