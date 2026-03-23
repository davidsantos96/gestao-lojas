import styled from 'styled-components';

export const HeaderContainer = styled.header`
  padding: 12px 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
  gap: 12px;
`;

export const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

export const ToggleSidebarBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.muted};
  flex-shrink: 0;
  transition: color 0.15s, background 0.15s;

  &:hover {
    color: ${props => props.theme.colors.text};
    background: ${props => props.theme.colors.s3};
  }
`;

export const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${props => props.theme.colors.muted};
  overflow: hidden;

  span {
    white-space: nowrap;
  }

  .title {
    color: ${props => props.theme.colors.text};
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const RightGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-shrink: 0;
`;

export const DateTimeDisplay = styled.div`
  font-size: 11px;
  color: ${props => props.theme.colors.muted};
  font-family: monospace;
  display: flex;
  align-items: center;
  gap: 6px;

  .time-badge {
    background: ${props => props.theme.colors.s3};
    padding: 2px 6px;
    border-radius: 4px;
    color: ${props => props.theme.colors.accent};
    letter-spacing: 1px;
  }
`;

export const IconButton = styled.button`
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: ${props => props.theme.colors.muted};
  transition: color 0.2s;

  &:hover {
    color: ${props => props.theme.colors.text};
  }

  .nav-dot {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background: ${props => props.theme.colors.red};
  }
`;
