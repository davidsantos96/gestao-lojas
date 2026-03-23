import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${props => props.$darker ? 'rgba(0,0,0,.9)' : (props.$dark ? 'rgba(0,0,0,.75)' : 'rgba(0,0,0,.7)')};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${props => props.$zIndex || 100};
  cursor: ${props => props.$zoomOut ? 'zoom-out' : 'default'};
`

export const ModalContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 32px;
  width: ${props => props.$width || '480px'};
  position: relative;
  max-height: ${props => props.$maxHeight || 'auto'};
  display: flex;
  flex-direction: column;
`

export const CloseBtn = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

export const ModalModule = styled.div`
  font-size: 11px;
  color: ${props => props.theme.colors.blue};
  font-family: monospace;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: ${props => props.$mb || '8px'};
`

export const ModalTitle = styled.h3`
  font-size: ${props => props.$size || '18px'};
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.$mb || '24px'};
`

export const ModalDesc = styled.p`
  font-size: 12px;
  color: ${props => props.theme.colors.muted};
  margin-bottom: 24px;
`

export const FormWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const TypeToggleWrap = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  padding: 4px;
  background: ${props => props.theme.colors.s2};
  border-radius: 10px;
  border: 1px solid ${props => props.theme.colors.border};
`

export const TypeToggleBtn = styled.button`
  flex: 1;
  padding: 8px 0;
  border-radius: 7px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all .15s;
  background: ${props => props.$active ? (props.$isReceita ? 'rgba(0,217,168,.15)' : 'rgba(255,91,107,.15)') : 'transparent'};
  color: ${props => props.$active ? (props.$isReceita ? props.theme.colors.accent : props.theme.colors.red) : props.theme.colors.muted};
`

export const FieldWrap = styled.div`
  display: flex;
  flex-direction: column;
`

export const Grid2 = styled.div`
  display: grid;
  grid-template-columns: ${props => props.$single ? '1fr' : '1fr 1fr'};
  gap: 12px;
`

export const Label = styled.label`
  font-size: 11px;
  color: ${props => props.theme.colors.muted};
  font-family: monospace;
  letter-spacing: 1px;
  text-transform: uppercase;
  display: block;
  margin-bottom: 6px;
`

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  background: ${props => props.theme.colors.s2};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 13px;
  outline: none;
  color-scheme: ${props => props.type === 'date' ? 'dark' : 'auto'};

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  background: ${props => props.theme.colors.s2};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 13px;
  outline: none;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const ErrorBox = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.red};
  background: rgba(255,91,107,.08);
  border: 1px solid rgba(255,91,107,.25);
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: ${props => props.$mb ? '12px' : '0'};
`

export const ActionsWrap = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 8px;
`

export const CancelBtn = styled.button`
  flex: 1;
  padding: 11px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background: none;
  color: ${props => props.theme.colors.muted};
  font-size: 13px;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const SubmitBtn = styled.button`
  flex: 1;
  padding: 11px;
  border-radius: 8px;
  border: none;
  background: ${props => props.$loading ? props.theme.colors.blueD : props.theme.colors.blue};
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  cursor: ${props => props.$loading ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  svg {
    animation: ${props => props.$loading ? `${spin} 1s linear infinite` : 'none'};
  }
`

/* ModalAnexos specifics */
export const DropZone = styled.div`
  border: 2px dashed ${props => props.$active ? props.theme.colors.blue : props.theme.colors.border};
  border-radius: 10px;
  padding: 22px 16px;
  text-align: center;
  cursor: pointer;
  background: ${props => props.$active ? 'rgba(79,143,255,.06)' : props.theme.colors.s2};
  transition: all .15s;
  margin-bottom: 20px;
  flex-shrink: 0;
`

export const DropTitle = styled.div`
  font-size: 13px;
  color: ${props => props.$active ? props.theme.colors.blue : props.theme.colors.text};
  font-weight: 600;
`

export const DropSub = styled.div`
  font-size: 11px;
  color: ${props => props.theme.colors.muted};
  margin-top: 4px;
`

export const FilesList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const EmptyFiles = styled.div`
  text-align: center;
  padding: 24px 0;
  color: ${props => props.theme.colors.muted};
  font-size: 13px;

  svg {
    margin-bottom: 8px;
    display: block;
    margin: 0 auto 8px;
  }
`

export const FileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: ${props => props.theme.colors.s2};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
`

export const FileIconWrap = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${props => props.theme.colors.s3};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

export const FileInfo = styled.div`
  flex: 1;
  min-width: 0;
`

export const FileName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const FileSize = styled.div`
  font-size: 11px;
  color: ${props => props.theme.colors.muted};
`

export const FileActions = styled.div`
  display: flex;
  gap: 6px;
  flex-shrink: 0;
`

export const FileBtn = styled.button`
  padding: 5px 7px;
  background: ${props => props.theme.colors.s3};
  border: 1px solid ${props => props.$danger ? 'rgba(255,91,107,.3)' : props.theme.colors.border};
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
`

export const FileLink = styled.a`
  padding: 5px 7px;
  background: ${props => props.theme.colors.s3};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  text-decoration: none;
`

export const ModalAnexosFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
`

export const FooterCount = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.muted};
`

export const FooterBtn = styled.button`
  padding: 9px 20px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background: none;
  color: ${props => props.theme.colors.text};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
`

export const PreviewImg = styled.img`
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 8px;
  object-fit: contain;
`

export const PreviewClose = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0,0,0,.6);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 6px 8px;
  cursor: pointer;
`

export const PreviewLabel = styled.div`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: ${props => props.theme.colors.muted};
  background: rgba(0,0,0,.6);
  padding: 4px 12px;
  border-radius: 20px;
`
