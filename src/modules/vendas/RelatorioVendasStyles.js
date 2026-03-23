import styled from 'styled-components';
import { Card } from '../../components/ui/Card';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

/* --- Filter Area --- */
export const FilterCard = styled(Card)`
  padding: 14px 18px;
`;

export const FilterRow = styled.div`
  display: flex;
  gap: 14px;
  align-items: flex-end;
  flex-wrap: wrap;
`;

export const FilterTitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;

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

export const FilterBadge = styled.div`
  font-size: 11px;
  color: ${props => props.theme.colors.muted};
  padding: 6px 10px;
  background: ${props => props.theme.colors.s2};
  border-radius: 7px;
  border: 1px solid ${props => props.theme.colors.border};
  align-self: flex-end;
`;

/* --- KPI Grid --- */
export const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

/* --- Charts Area --- */
export const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const ChartCard = styled(Card)``;

export const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const ChartTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

export const ChartSubtitle = styled.div`
  font-size: 11px;
  color: ${props => props.theme.colors.muted};
  margin-top: 2px;
`;

export const EmptyChartText = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.muted};
  padding: 40px 0;
  font-size: 13px;
`;

/* Custom Tooltip */
export const TooltipWrap = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

export const TooltipTitle = styled.div`
  color: ${props => props.theme.colors.muted};
  margin-bottom: 4px;
`;

export const TooltipValue = styled.div`
  font-weight: 700;
  color: ${props => props.theme.colors.accent};
`;

/* --- Ranking Table --- */
export const RankingCard = styled(Card)`
  padding: 0;
  overflow: hidden;
`;

export const RankingHeader = styled.div`
  padding: 16px 18px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.s2};
`;

export const RankingTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead tr {
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }

  tbody tr {
    border-bottom: 1px solid ${props => props.theme.colors.border};
    transition: background .12s;

    &:last-child {
      border-bottom: none;
    }
    &:hover {
      background: rgba(255,255,255,0.02);
      background: ${props => props.theme.colors.s3};
    }
  }
`;

export const RankingTh = styled.th`
  padding: 10px 14px;
  text-align: ${props => props.$align || 'left'};
  font-size: 10px;
  color: ${props => props.theme.colors.muted};
  font-family: monospace;
  letter-spacing: 1.5px;
  font-weight: 600;
  text-transform: uppercase;
`;

export const RankingTd = styled.td`
  padding: 11px 14px;
  text-align: ${props => props.$align || 'left'};
`;

export const RankingIndexBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 800;
`;

export const RankingProductName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

export const RankingProductSku = styled.div`
  font-size: 10px;
  color: ${props => props.theme.colors.muted};
  font-family: monospace;
  margin-top: 2px;
`;

export const RankingTdQty = styled.td`
  padding: 11px 14px;
  font-size: 13px;
  font-weight: 700;
  color: ${props => props.theme.colors.muted2};
  text-align: right;
`;

export const RankingTdRevenue = styled.td`
  padding: 11px 14px;
  font-size: 14px;
  font-weight: 800;
  text-align: right;
  color: ${props => props.theme.colors.accent};
`;
