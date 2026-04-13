import styled from 'styled-components'

export const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-top: 1px solid ${p => p.theme.colors.border};
  flex-wrap: wrap;
  gap: 8px;
`

export const Info = styled.span`
  font-size: 12px;
  color: ${p => p.theme.colors.muted};
`

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

export const PageBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  height: 30px;
  padding: 0 8px;
  border-radius: 6px;
  border: 1px solid ${p => p.$active ? p.theme.colors.accent : p.theme.colors.border};
  background: ${p => p.$active ? `${p.theme.colors.accent}18` : 'transparent'};
  color: ${p => p.$active ? p.theme.colors.accent : p.theme.colors.muted2};
  font-size: 12px;
  font-weight: ${p => p.$active ? 700 : 400};
  cursor: pointer;
  transition: all .15s;

  &:hover:not(:disabled) {
    border-color: ${p => p.theme.colors.accent};
    color: ${p => p.theme.colors.accent};
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`

export const Ellipsis = styled.span`
  font-size: 12px;
  color: ${p => p.theme.colors.muted};
  padding: 0 2px;
`

export const PageSizeWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${p => p.theme.colors.muted};
`

export const PageSizeBtn = styled.button`
  height: 26px;
  padding: 0 8px;
  border-radius: 5px;
  border: 1px solid ${p => p.$active ? p.theme.colors.accent : p.theme.colors.border};
  background: ${p => p.$active ? `${p.theme.colors.accent}18` : 'transparent'};
  color: ${p => p.$active ? p.theme.colors.accent : p.theme.colors.muted2};
  font-size: 11px;
  font-weight: ${p => p.$active ? 700 : 400};
  cursor: pointer;
  transition: all .15s;

  &:hover {
    border-color: ${p => p.theme.colors.accent};
    color: ${p => p.theme.colors.accent};
  }
`
