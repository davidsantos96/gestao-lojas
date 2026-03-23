import styled, { css, keyframes } from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

export const ModalWrapper = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 32px;
  width: ${props => props.$width || '540px'};
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
`;

export const CloseBtn = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.colors.muted};

  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

export const ModalBadge = styled.div`
  font-size: 11px;
  color: ${props => props.theme.colors.accent};
  font-family: monospace;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 8px;
`;

export const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 24px;
`;

export const FormStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

export const FormGridUnequal = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 12px;
`;

export const FormLabel = styled.label`
  font-size: 11px;
  color: ${props => props.theme.colors.muted};
  font-family: monospace;
  letter-spacing: 1px;
  text-transform: uppercase;
  display: block;
  margin-bottom: 6px;
`;

export const FormInputWrapper = styled.div`
  position: relative;
`;

export const FormInput = styled.input`
  width: 100%;
  padding: ${props => props.$padding || '10px 12px'};
  background: ${props => props.theme.colors.s2};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 13px;
  outline: none;
  box-sizing: border-box;
  opacity: ${props => props.disabled && !props.$allowAppearance ? 0.6 : 1};
  transition: border-color .15s;
  color-scheme: ${props => props.theme.title};

  &:focus {
    border-color: ${props => props.theme.colors.accent};
  }
  &::placeholder {
    color: ${props => props.theme.colors.muted};
  }
`;

export const FormSelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  background: ${props => props.theme.colors.s2};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 13px;
  outline: none;
  box-sizing: border-box;
  color-scheme: ${props => props.theme.title};

  &:focus {
    border-color: ${props => props.theme.colors.accent};
  }

  option {
    background: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.text};
  }
`;

export const ErrorBox = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.red};
  background: ${props => props.theme.colors.red}14;
  border: 1px solid ${props => props.theme.colors.red}40;
  border-radius: 8px;
  padding: 8px 12px;
`;

export const ActionsWrap = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 4px;
`;

export const CancelBtn = styled.button`
  flex: 1;
  padding: 11px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background: none;
  color: ${props => props.theme.colors.muted};
  font-size: 13px;
  cursor: pointer;
  transition: all .15s;

  &:hover {
    background: ${props => props.theme.colors.s2};
    color: ${props => props.theme.colors.text};
  }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const SubmitBtn = styled.button`
  flex: 1;
  padding: 11px;
  border-radius: 8px;
  border: none;
  background: ${props => props.disabled ? props.theme.colors.accentD : props.theme.colors.accent};
  color: #0b1a14;
  font-weight: 700;
  font-size: 13px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: opacity .15s;

  &:hover:not(:disabled) {
    opacity: 0.85;
  }

  svg {
    animation: ${props => props.$loading ? css`${spin} 1s linear infinite` : 'none'};
  }
`;

/* --- Margin Calculator --- */
export const MarginCalcBox = styled.div`
  padding: 10px 14px;
  background: ${props => props.theme.colors.s2};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  gap: 24px;
`;

export const MarginColumn = styled.div``;

export const MarginLabel = styled.div`
  font-size: 10px;
  color: ${props => props.theme.colors.muted};
  font-family: monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const MarginValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.$color};
`;

/* --- Color Picker Specific --- */
export const ColorPickerContainer = styled.div`
  position: relative;
  margin-bottom: 10px;
`;

export const ColorInputFlex = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const ColorPreviewAbsolute = styled.span`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${props => props.$hex};
  border: ${props => props.$hex === '#f5f5f5' ? '1px solid #555' : 'none'};
  flex-shrink: 0;
`;

export const ColorChipSelected = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border-radius: 20px;
  background: ${props => props.$hex ? `${props.$hex}22` : props.theme.colors.s2};
  border: 1.5px solid ${props => props.$hex || props.theme.colors.border};
  white-space: nowrap;

  .chip-circle {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${props => props.$hex};
    flex-shrink: 0;
  }

  .chip-text {
    font-size: 12px;
    font-weight: 600;
    color: ${props => props.$hex || props.theme.colors.muted2};
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    color: ${props => props.theme.colors.muted};
    font-size: 13px;
    line-height: 1;
    padding: 0;
    margin-left: 2px;
  }
`;

export const SuggestionsDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  margin-top: 4px;
  z-index: 50;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,.4);
`;

export const SuggestionItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  border-top: ${props => props.$borderTop ? `1px solid ${props.theme.colors.border}` : 'none'};

  &:hover {
    background: ${props => props.theme.colors.s2};
  }

  .sugg-circle {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: ${props => props.$hex};
    flex-shrink: 0;
    border: ${props => props.$hex === '#f5f5f5' ? `1px solid ${props.theme.colors.border}` : 'none'};
  }

  .sugg-text {
    font-size: 13px;
    color: ${props => props.theme.colors.text};
  }

  .sugg-hex {
    font-size: 11px;
    color: ${props => props.theme.colors.muted};
    margin-left: auto;
  }
`;

export const UnknownColorText = styled.div`
  padding: 10px 14px;
  font-size: 12px;
  color: ${props => props.theme.colors.muted};
`;

export const PaletteWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const PaletteChip = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.$hex};
  border: 2px solid ${props => props.theme.colors.border};
  cursor: pointer;
  transition: transform .1s;

  &:hover {
    transform: scale(1.25);
  }
`;

export const TypeBtnWrap = styled.div`
  display: flex;
  gap: 8px;
`;

export const TypeBtn = styled.button`
  flex: 1;
  padding: 9px 0;
  border-radius: 8px;
  border: 1.5px solid ${props => props.$active ? props.$color : props.theme.colors.border};
  background: ${props => props.$active ? `${props.$color}18` : props.theme.colors.s2};
  color: ${props => props.$active ? props.$color : props.theme.colors.muted};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all .12s;

  &:hover {
    background: ${props => props.$active ? `${props.$color}26` : props.theme.colors.s3};
  }
`;

export const NoticeBox = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: ${props => props.theme.colors.accent};
  background: ${props => props.theme.colors.accent}1A;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.colors.accent}40;

  b {
    font-weight: 700;
  }
`;
