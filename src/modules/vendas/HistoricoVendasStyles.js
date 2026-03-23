import styled from 'styled-components';
import { Card } from '../../components/ui/Card';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/* --- Filters --- */
export const FiltersCard = styled(Card)`
  padding: 14px 18px;
`;

export const FiltersRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: flex-end;
`;

export const FilterTitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  margin-right: 4px;

  span {
    font-size: 12px;
    font-weight: 600;
    color: ${props => props.theme.colors.muted};
  }
`;

export const FilterGroup = styled.div``;

export const FilterLabel = styled.label`
  font-size: 10px;
  color: ${props => props.theme.colors.muted};
  font-family: monospace;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  display: block;
  margin-bottom: 5px;
`;

export const FilterInput = styled.input`
  padding: 9px 12px;
  background: ${props => props.theme.colors.bg};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 9px;
  color: ${props => props.theme.colors.text};
  font-size: 12px;
  outline: none;
  transition: border-color .15s;
  color-scheme: ${props => props.theme.title};

  &:focus {
    border-color: ${props => props.theme.colors.accent};
  }
`;

export const SearchWrap = styled.div`
  position: relative;

  .search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }
`;

export const SearchInput = styled(FilterInput)`
  padding-left: 28px;
  width: 160px;
  &::placeholder {
    color: ${props => props.theme.colors.muted};
  }
`;

export const ClearFiltersBtn = styled.button`
  padding: 9px 14px;
  background: none;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 9px;
  color: ${props => props.theme.colors.muted};
  font-size: 12px;
  cursor: pointer;
  transition: all .15s;

  &:hover {
    background: ${props => props.theme.colors.s2};
    color: ${props => props.theme.colors.text};
  }
`;

export const TotalCountBadge = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${props => props.theme.colors.s2};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 6px 12px;

  .count {
    font-size: 16px;
    font-weight: 800;
    color: ${props => props.theme.colors.text};
  }
  .label {
    font-size: 12px;
    color: ${props => props.theme.colors.muted};
  }
`;

/* --- Empty State --- */
export const EmptyStateWrap = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.muted};
  padding: 48px 0;
  font-size: 13px;
`;

/* --- Table --- */
export const TableCard = styled(Card)`
  padding: 0;
  overflow: hidden;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Th = styled.th`
  padding: 13px 16px;
  text-align: left;
  font-size: 10px;
  color: ${props => props.theme.colors.muted};
  font-family: monospace;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-weight: 600;
  white-space: nowrap;
`;

export const Tr = styled.tr`
  border-bottom: ${props => props.$isOpen ? 'none' : `1px solid ${props.theme.colors.border}`};
  background: ${props => props.$isOpen ? `${props.theme.colors.accent}14` : (props.$isEven ? 'transparent' : props.theme.colors.s2)};
  cursor: pointer;
  transition: background .12s;

  &:hover {
    background: ${props => props.$isOpen ? `${props.theme.colors.accent}1A` : props.theme.colors.s3};
  }
`;

export const Td = styled.td`
  padding: 14px 16px;
  font-size: ${props => props.$fontSize || '12px'};
  color: ${props => props.$color || props.theme.colors.muted};
  font-weight: ${props => props.$weight || 400};
  white-space: ${props => props.$nowrap ? 'nowrap' : 'normal'};
  font-family: ${props => props.$mono ? 'monospace' : 'inherit'};

  .items-badge {
    background: ${props => props.theme.colors.s2};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 5px;
    padding: 2px 7px;
    font-size: 11px;
    color: ${props => props.theme.colors.muted};
  }
`;

export const ActionsWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ActionBtn = styled.button`
  padding: 4px 10px;
  border-radius: 7px;
  font-size: 11px;
  cursor: pointer;
  transition: all .15s;
  white-space: nowrap;

  background: ${props => props.$confirming ? `${props.theme.colors.red}26` : 'transparent'};
  border: 1px solid ${props => props.$confirming ? props.theme.colors.red : `${props.theme.colors.red}4D`};
  color: ${props => props.theme.colors.red};

  &:hover {
    background: ${props => props.theme.colors.red}26;
  }
`;

export const ChevronIconWrap = styled.div`
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: transform .2s;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.muted};
`;

/* --- Nested Detail Table --- */
export const DetailWrap = styled.div`
  margin: 0 16px 16px;
  background: ${props => props.theme.colors.s2};
  border-radius: 10px;
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;
`;

export const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: rgba(0,0,0,.05);

  span {
    font-size: 12px;
    font-weight: 700;
    color: ${props => props.theme.colors.muted2};
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px;
    color: ${props => props.theme.colors.muted};

    &:hover {
      color: ${props => props.theme.colors.text};
    }
  }
`;

export const DetailTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead tr {
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }

  tbody tr {
    border-bottom: 1px solid ${props => props.theme.colors.border}40;
  }
  tbody tr:last-child {
    border-bottom: none;
  }
`;

export const DetailTh = styled.th`
  padding: 8px 14px;
  text-align: ${props => props.$align || 'left'};
  font-size: 10px;
  color: ${props => props.theme.colors.muted};
  font-family: monospace;
  letter-spacing: 1px;
  font-weight: 500;
`;

export const DetailTd = styled.td`
  padding: 9px 14px;
  font-size: ${props => props.$fontSize || '12px'};
  color: ${props => props.$color || props.theme.colors.muted};
  font-weight: ${props => props.$weight || 400};
  font-family: ${props => props.$mono ? 'monospace' : 'inherit'};
  text-align: ${props => props.$align || 'left'};
`;

export const DetailTotalWrap = styled.div`
  padding: 10px 14px;
  border-top: 1px solid ${props => props.theme.colors.border};
  text-align: right;

  .discount-text {
    font-size: 12px;
    color: ${props => props.theme.colors.red};
    margin-bottom: 4px;
  }

  .total-text {
    font-size: 15px;
    font-weight: 800;
    color: ${props => props.theme.colors.text};

    .accent {
      color: ${props => props.theme.colors.accent};
    }
  }
`;
