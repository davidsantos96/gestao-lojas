import styled, { keyframes, css } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

/* --- Header --- */
export const HeaderWrap = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const HeaderLeft = styled.div``;

export const ModuleBadge = styled.div`
  font-size: 11px;
  color: ${props => props.theme.colors.accent};
  font-family: monospace;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 6px;
`;

export const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  letter-spacing: -0.5px;
  margin: 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const RefreshBtn = styled.button`
  padding: 9px 12px;
  border-radius: 8px;
  background: ${props => props.theme.colors.s2};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.disabled ? props.theme.colors.muted : props.theme.colors.muted2};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  transition: all .2s;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.s3};
    color: ${props => props.theme.colors.text};
  }

  svg {
    ${props => props.$refreshing && css`
      animation: ${spin} 0.8s linear infinite;
    `}
  }
`;

export const CtaBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border-radius: 8px;
  border: none;
  background: ${props => props.$color};
  color: ${props => props.$textColor};
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: opacity .15s;

  &:hover {
    opacity: 0.85;
  }
`;

/* --- KPIs --- */
export const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

/* --- Tabs --- */
export const TabsWrap = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

export const TabBtn = styled.button`
  padding: 10px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.$active ? props.theme.colors.accent : props.theme.colors.muted};
  border-bottom: ${props => props.$active ? `2px solid ${props.theme.colors.accent}` : '2px solid transparent'};
  margin-bottom: -1px;
  transition: color .2s, border-bottom-color .2s;

  &:hover {
    color: ${props => props.$active ? props.theme.colors.accent : props.theme.colors.text};
  }
`;

/* --- Filters (Products Tab) --- */
export const FiltersWrap = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

export const SearchBox = styled.div`
  flex: 1;
  position: relative;
  min-width: 250px;

  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 9px 12px 9px 34px;
  background: ${props => props.theme.colors.s2};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 13px;
  outline: none;
  transition: border-color .15s;
  box-sizing: border-box;

  &:focus {
    border-color: ${props => props.theme.colors.accent};
  }
  &::placeholder {
    color: ${props => props.theme.colors.muted};
  }
`;

export const StatusFiltersWrap = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

export const FilterBtn = styled.button`
  padding: 9px 14px;
  border-radius: 8px;
  border: 1px solid ${props => props.$active ? props.theme.colors.accent : props.theme.colors.border};
  background: ${props => props.$active ? `${props.theme.colors.accent}1A` : props.theme.colors.s2};
  color: ${props => props.$active ? props.theme.colors.accent : props.theme.colors.muted};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all .15s;

  &:hover {
    background: ${props => props.$active ? `${props.theme.colors.accent}26` : props.theme.colors.s3};
    color: ${props => props.$active ? props.theme.colors.accent : props.theme.colors.text};
  }
`;
