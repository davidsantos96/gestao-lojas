import styled, { keyframes, css } from 'styled-components'

// ─── Layout ────────────────────────────────────────────────────────────────

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`

export const HeaderWrap = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
`

export const HeaderLeft = styled.div``

export const ModuleBadge = styled.div`
  font-size: 11px;
  color: ${p => p.theme.colors.purple};
  font-family: monospace;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 6px;
`

export const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: ${p => p.theme.colors.text};
  letter-spacing: -0.5px;
  margin: 0;
`

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`

// ─── PeriodFilter ──────────────────────────────────────────────────────────

export const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: ${p => p.theme.colors.s2};
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`

export const FilterLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${p => p.theme.colors.muted2};
  font-family: monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-right: 4px;
`

export const PresetBtn = styled.button`
  padding: 5px 12px;
  border-radius: 6px;
  border: 1px solid ${p => p.$active ? p.theme.colors.purple : p.theme.colors.border};
  background: ${p => p.$active ? `${p.theme.colors.purple}18` : 'transparent'};
  color: ${p => p.$active ? p.theme.colors.purple : p.theme.colors.muted2};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all .15s;

  &:hover {
    border-color: ${p => p.theme.colors.purple};
    color: ${p => p.theme.colors.purple};
  }
`

export const Divider = styled.div`
  width: 1px;
  height: 18px;
  background: ${p => p.theme.colors.border};
  margin: 0 4px;
`

export const DateInput = styled.input`
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid ${p => p.theme.colors.border};
  background: ${p => p.theme.colors.s3};
  color: ${p => p.theme.colors.text};
  font-size: 12px;
  font-family: monospace;
  cursor: pointer;
  transition: border-color .15s;

  &:focus {
    outline: none;
    border-color: ${p => p.theme.colors.purple};
  }

  &::-webkit-calendar-picker-indicator {
    filter: invert(0.5);
    cursor: pointer;
  }
`

// ─── Tabs ──────────────────────────────────────────────────────────────────

export const TabsWrap = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 24px;
  border-bottom: 1px solid ${p => p.theme.colors.border};
  overflow-x: auto;

  &::-webkit-scrollbar { height: 0; }
`

export const TabBtn = styled.button`
  padding: 10px 18px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  color: ${p => p.$active ? p.theme.colors.purple : p.theme.colors.muted};
  border-bottom: ${p => p.$active ? `2px solid ${p.theme.colors.purple}` : '2px solid transparent'};
  margin-bottom: -1px;
  transition: all .15s;

  &:hover {
    color: ${p => p.$active ? p.theme.colors.purple : p.theme.colors.text};
  }
`

// ─── Refresh button ────────────────────────────────────────────────────────

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`

export const RefreshBtn = styled.button`
  padding: 9px 12px;
  border-radius: 8px;
  background: ${p => p.theme.colors.s2};
  border: 1px solid ${p => p.theme.colors.border};
  color: ${p => p.$spinning ? p.theme.colors.muted : p.theme.colors.muted2};
  cursor: ${p => p.$spinning ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  transition: all .15s;

  &:hover:not(:disabled) {
    background: ${p => p.theme.colors.s3};
    color: ${p => p.theme.colors.text};
  }

  svg {
    animation: ${p => p.$spinning ? css`${spin} 0.8s linear infinite` : 'none'};
  }
`

// ─── Export Button ─────────────────────────────────────────────────────────

export const ExportWrap = styled.div`
  position: relative;
  display: inline-flex;
`

export const ExportTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 14px;
  border-radius: 8px;
  border: 1px solid ${p => p.theme.colors.border};
  background: ${p => p.theme.colors.s2};
  color: ${p => p.theme.colors.muted2};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all .15s;

  &:hover {
    background: ${p => p.theme.colors.s3};
    color: ${p => p.theme.colors.text};
    border-color: ${p => p.theme.colors.purple};
  }
`

export const ExportDropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 180px;
  background: ${p => p.theme.colors.card};
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 10px;
  padding: 6px;
  box-shadow: 0 8px 24px rgba(0,0,0,.28);
  z-index: 100;
`

export const ExportOption = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: ${p => p.theme.colors.text};
  font-size: 13px;
  cursor: pointer;
  text-align: left;
  transition: background .12s;

  &:hover { background: ${p => p.theme.colors.s3}; }

  svg { color: ${p => p.theme.colors.muted}; flex-shrink: 0; }
`
