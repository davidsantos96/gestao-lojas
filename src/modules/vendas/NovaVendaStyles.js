import styled, { keyframes, css } from 'styled-components';
import { Card } from '../../components/ui/Card';

/* --- Success Screen --- */
export const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 72px 40px;
  gap: 20px;
  background: ${props => props.theme.colors.surface};
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.border};
`;

export const SuccessIconWrap = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.theme.colors.accent}18;
  border: 2px solid ${props => props.theme.colors.accent}40;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SuccessTitle = styled.h3`
  font-size: 22px;
  font-weight: 800;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px;
`;

export const SuccessText = styled.p`
  color: ${props => props.theme.colors.muted};
  font-size: 14px;
  margin: 0;
  line-height: 1.6;
  strong { color: ${props => props.theme.colors.muted2}; }
  .accent { color: ${props => props.theme.colors.accent}; font-weight: 700; }
`;

export const SuccessBtn = styled.button`
  padding: 11px 28px;
  border-radius: 10px;
  border: none;
  background: ${props => props.theme.colors.accent};
  color: #051a12;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  margin-top: 4px;
  transition: opacity .15s;
  &:hover { opacity: 0.85; }
`;

/* --- Main Layout --- */
export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 80px; /* Space for floating btn */
`;

export const SearchCard = styled(Card)`
  padding: 14px 18px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};

  .search-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  &::placeholder { color: ${props => props.theme.colors.muted}; }
`;

export const SearchClearBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.colors.muted};
  font-size: 11px;
  &:hover { color: ${props => props.theme.colors.text}; }
`;

export const ResultCount = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.muted};
  padding: 0 4px;
`;

/* --- Data Table --- */
export const TableCard = styled(Card)`
  padding: 0;
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.border};
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

export const Thead = styled.thead`
  background: ${props => props.theme.colors.s2};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

export const Th = styled.th`
  padding: 12px 18px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${props => props.theme.colors.muted};
  font-weight: 600;
  &:last-child { text-align: right; }
`;

export const Tr = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  transition: background 0.1s;
  background: ${props => props.$inCart ? props.theme.colors.accent + '08' : 'transparent'};
  
  &:hover {
    background: ${props => props.$inCart ? props.theme.colors.accent + '12' : props.theme.colors.s2};
  }
  &:last-child { border-bottom: none; }
`;

export const Td = styled.td`
  padding: 14px 18px;
  vertical-align: middle;
  &:last-child { text-align: right; }
`;

export const SkuBadge = styled.span`
  font-family: monospace;
  font-size: 11px;
  background: ${props => props.theme.colors.bg};
  border: 1px solid ${props => props.theme.colors.border};
  padding: 3px 6px;
  border-radius: 4px;
  color: ${props => props.theme.colors.muted};
`;

export const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  .name {
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
  }
  .tags {
    display: flex;
    gap: 6px;
    font-size: 10px;
    .stock { color: ${props => props.theme.colors.muted}; }
    .incart { color: ${props => props.theme.colors.accent}; font-weight: 600; }
  }
`;

export const ProductPrice = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

export const ActionBtn = styled.button`
  background: ${props => props.$inCart ? props.theme.colors.surface : props.theme.colors.accent + '15'};
  border: 1px solid ${props => props.$inCart ? props.theme.colors.border : props.theme.colors.accent + '40'};
  color: ${props => props.$inCart ? props.theme.colors.muted : props.theme.colors.accent};
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$inCart ? props.theme.colors.s3 : props.theme.colors.accent + '30'};
  }
`;

export const EmptyProducts = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.muted};
  padding: 60px 0;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

/* --- Floating Button --- */
export const FloatingCartBtn = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 30px;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  box-shadow: 0 8px 30px rgba(0,0,0,0.5);
  z-index: 100;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.6);
  }

  .icon-wrap {
    color: ${props => props.theme.colors.accent};
    position: relative;
    display: flex;
  }
  
  .text-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    
    .lbl { font-size: 11px; color: ${props => props.theme.colors.muted}; text-transform: uppercase; letter-spacing: 1px; }
    .val { font-size: 14px; font-weight: 800; color: ${props => props.theme.colors.text}; }
  }

  .badge {
    position: absolute;
    top: -6px;
    right: -8px;
    background: ${props => props.theme.colors.accent};
    color: #000;
    font-size: 10px;
    font-weight: 800;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

/* --- Drawer Overlay --- */
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const slideIn = keyframes`from { transform: translateX(100%); } to { transform: translateX(0); }`;

export const DrawerOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 900;
  display: flex;
  justify-content: flex-end;
  animation: ${fadeIn} 0.2s ease-out;
`;

export const DrawerContent = styled.div`
  width: 420px;
  max-width: 100%;
  height: 100%;
  background: ${props => props.theme.colors.surface};
  border-left: 1px solid ${props => props.theme.colors.border};
  box-shadow: -10px 0 40px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  animation: ${slideIn} 0.25s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.s2};
  
  .title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
  }
`;

export const DrawerCloseBtn = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.muted};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  &:hover { background: ${props => props.theme.colors.s3}; color: ${props => props.theme.colors.text}; }
`;

export const CartBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 24px;
`;

export const EmptyCart = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.muted};
  padding: 40px 0;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

export const CartList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 12px 0;
`;

export const CartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

export const CartItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const CartItemName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CartItemPrice = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.muted};
`;

export const QtyControls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const QtyBtn = styled.button`
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.s2};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  color: ${props => props.theme.colors.text};
  opacity: ${props => props.disabled ? 0.4 : 1};
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover:not(:disabled) { background: ${props => props.theme.colors.s3}; }
`;

export const QtyValue = styled.span`
  width: 24px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

export const CartItemTotal = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  width: 70px;
  text-align: right;
`;

export const RemoveBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: ${props => props.theme.colors.muted};
  &:hover { color: ${props => props.theme.colors.red}; }
`;

/* --- Form --- */
export const FormArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: ${props => props.theme.colors.s2};
  border-top: 1px solid ${props => props.theme.colors.border};
`;

export const FormLabel = styled.label`
  font-size: 10px;
  color: ${props => props.theme.colors.muted};
  font-family: monospace;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  display: block;
  margin-bottom: 8px;
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  background: ${props => props.theme.colors.bg};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  outline: none;
  transition: border-color .15s;
  box-sizing: border-box;
  color-scheme: ${props => props.theme.title};
  &:focus { border-color: ${props => props.theme.colors.accent}; }
  &::placeholder { color: ${props => props.theme.colors.muted}; }
`;

export const FormSelect = styled.select`
  width: 100%;
  padding: 12px 14px;
  appearance: none;
  background: ${props => props.theme.colors.bg};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  outline: none;
  transition: border-color .15s;
  box-sizing: border-box;
  color-scheme: ${props => props.theme.title};
  &:focus { border-color: ${props => props.theme.colors.accent}; }
  option { background: ${props => props.theme.colors.s2}; color: ${props => props.theme.colors.text}; }
`;

export const TotalsBox = styled.div`
  background: ${props => props.theme.colors.bg};
  border-radius: 10px;
  padding: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: ${props => props.$discount ? props.theme.colors.red : props.theme.colors.muted};
`;

export const TotalRowMain = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: 800;
  color: ${props => props.theme.colors.text};
  padding-top: 10px;
  border-top: 1px dashed ${props => props.theme.colors.border};
  margin-top: 4px;
  .accent { color: ${props => props.theme.colors.accent}; }
`;

export const ErrorBox = styled.div`
  font-size: 13px;
  color: ${props => props.theme.colors.red};
  background: rgba(255,91,107,.08);
  border: 1px solid rgba(255,91,107,.25);
  border-radius: 8px;
  padding: 12px;
`;

export const SubmitBtn = styled.button`
  padding: 16px;
  border-radius: 10px;
  border: none;
  font-weight: 800;
  font-size: 15px;
  letter-spacing: 0.2px;
  transition: all .2s;
  background: ${props => props.disabled ? props.theme.colors.s3 : props.theme.colors.accent};
  color: ${props => props.disabled ? props.theme.colors.muted : '#051a12'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  box-shadow: ${props => props.disabled ? 'none' : `0 4px 18px ${props.theme.colors.accent}35`};
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 22px ${props => props.theme.colors.accent}45;
  }
`;

export const PaymentMethodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

export const PaymentMethodBtn = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 6px;
  border-radius: 8px;
  background: ${props => props.$active ? props.theme.colors.accent + '15' : props.theme.colors.bg};
  border: 1px solid ${props => props.$active ? props.theme.colors.accent : props.theme.colors.border};
  color: ${props => props.$active ? props.theme.colors.accent : props.theme.colors.muted};
  cursor: pointer;
  transition: all 0.2s;
  
  .icon-holder {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  span {
    font-size: 11px;
    font-weight: ${props => props.$active ? '700' : '600'};
    text-align: center;
    line-height: 1.1;
  }

  &:hover {
    border-color: ${props => props.$active ? props.theme.colors.accent : props.theme.colors.text};
    color: ${props => props.$active ? props.theme.colors.accent : props.theme.colors.text};
  }
`;
