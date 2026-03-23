import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const HeaderArea = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 28px;
`;

export const HeaderLeft = styled.div``;

export const ModuleBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: ${props => props.theme.colors.accent};
  font-family: monospace;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 8px;
  background: ${props => props.theme.colors.accent}14;
  border: 1px solid ${props => props.theme.colors.accent}28;
  padding: 4px 10px;
  border-radius: 20px;
`;

export const Title = styled.h2`
  font-size: 26px;
  font-weight: 800;
  color: ${props => props.theme.colors.text};
  letter-spacing: -0.8px;
  line-height: 1;
  margin: 0;
`;

export const Subtitle = styled.p`
  font-size: 13px;
  color: ${props => props.theme.colors.muted};
  margin-top: 6px;
  margin-bottom: 0;
`;

export const RefreshButton = styled.button`
  padding: 9px 14px;
  border-radius: 10px;
  background: ${props => props.theme.colors.s2};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.muted};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  transition: all 0.15s;

  .icon {
    animation: ${props => props.$refreshing ? spin : 'none'} 0.8s linear infinite;
  }

  &:hover {
    background: ${props => props.disabled ? props.theme.colors.s2 : props.theme.colors.s3};
    color: ${props => props.disabled ? props.theme.colors.muted : props.theme.colors.text};
  }
`;

export const TabsContainer = styled.div`
  display: flex;
  gap: 2px;
  margin-bottom: 28px;
  background: ${props => props.theme.colors.s2};
  border-radius: 12px;
  padding: 4px;
  border: 1px solid ${props => props.theme.colors.border};
  width: fit-content;
`;

export const TabButton = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 20px;
  border-radius: 9px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.15s;
  background: ${props => props.$active ? props.theme.colors.surface : 'transparent'};
  color: ${props => props.$active ? props.theme.colors.text : props.theme.colors.muted};
  box-shadow: ${props => props.$active ? '0 1px 6px rgba(0,0,0,.35)' : 'none'};

  .icon-color {
    color: ${props => props.$active ? props.theme.colors.accent : 'inherit'};
  }

  &:hover {
    color: ${props => props.$active ? props.theme.colors.text : props.theme.colors.text};
  }
`;

export const ContentArea = styled.div``;
