import styled from 'styled-components';
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

  strong {
    color: ${props => props.theme.colors.muted2};
  }

  .accent {
    color: ${props => props.theme.colors.accent};
    font-weight: 700;
  }
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

  &:hover {
    opacity: 0.85;
  }
`;

/* --- Main Layout --- */
export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 20px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

/* --- Left Column (Products) --- */
export const LeftCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const SearchCard = styled(Card)`
  padding: 12px 16px;

  .search-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: ${props => props.theme.colors.text};
  font-size: 13px;

  &::placeholder {
    color: ${props => props.theme.colors.muted};
  }
`;

export const SearchClearBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.colors.muted};
  font-size: 11px;

  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

export const ResultCount = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.muted};
  padding-left: 2px;
`;

export const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(168px, 1fr));
  gap: 10px;
`;

export const ProductCard = styled.button`
  background: ${props => props.$inCart ? `${props.theme.colors.accent}14` : props.theme.colors.surface};
  border: 1.5px solid ${props => props.$inCart ? props.theme.colors.accent : props.theme.colors.border};
  border-radius: 12px;
  padding: 14px;
  cursor: pointer;
  text-align: left;
  transition: all .14s;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${props => props.$inCart ? props.theme.colors.accent : props.theme.colors.text};
  }
`;

export const CartBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${props => props.theme.colors.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: #051a12;
`;

export const ProductSku = styled.div`
  font-size: 10px;
  color: ${props => props.theme.colors.muted};
  font-family: monospace;
  letter-spacing: 0.5px;
  margin-bottom: 5px;
`;

export const ProductName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  line-height: 1.3;
  padding-right: ${props => props.$inCart ? '20px' : '0'};
`;

export const ProductPriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ProductPrice = styled.span`
  font-size: 15px;
  font-weight: 800;
  color: ${props => props.theme.colors.accent};
`;

export const ProductStock = styled.span`
  font-size: 10px;
  color: ${props => props.theme.colors.muted};
  background: ${props => props.theme.colors.s2};
  padding: 2px 6px;
  border-radius: 5px;
  border: 1px solid ${props => props.theme.colors.border};
`;

export const EmptyProducts = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  color: ${props => props.theme.colors.muted};
  padding: 48px 0;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

/* --- Right Column (Cart) --- */
export const RightCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  position: sticky;
  top: 0;
`;

export const CartCard = styled(Card)`
  padding: 0;
  overflow: hidden;
`;

export const CartHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 16px 18px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.s2};
`;

export const CartIconWrap = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${props => props.theme.colors.blue}18;
  border: 1px solid ${props => props.theme.colors.blue}30;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CartTitleWrap = styled.div`
  flex: 1;
  
  .title {
    font-size: 13px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
  }
  .subtitle {
    font-size: 11px;
    color: ${props => props.theme.colors.muted};
  }
`;

export const CartClearBtn = styled.button`
  background: none;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  cursor: pointer;
  font-size: 11px;
  color: ${props => props.theme.colors.muted};
  padding: 4px 8px;
  transition: all .15s;

  &:hover {
    color: ${props => props.theme.colors.text};
    background: ${props => props.theme.colors.s2};
  }
`;

export const CartBody = styled.div`
  padding: 0 18px;
`;

export const EmptyCart = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.muted};
  padding: 32px 0;
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
  padding: 8px 0;
`;

export const CartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

export const CartItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const CartItemName = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CartItemPrice = styled.div`
  font-size: 11px;
  color: ${props => props.theme.colors.muted};
  margin-top: 2px;
`;

export const QtyControls = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`;

export const QtyBtn = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.s2};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.4 : 1};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.s3};
  }
`;

export const QtyValue = styled.span`
  width: 26px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

export const CartItemTotal = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  min-width: 58px;
  text-align: right;
`;

export const RemoveBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 3px;
`;

/* --- Form --- */
export const FormArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 14px;
  padding-bottom: 18px;
`;

export const FormLabel = styled.label`
  font-size: 10px;
  color: ${props => props.theme.colors.muted};
  font-family: monospace;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  display: block;
  margin-bottom: 6px;
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 10px 13px;
  background: rgba(255,255,255,.04);
  background: ${props => props.theme.colors.bg};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 9px;
  color: ${props => props.theme.colors.text};
  font-size: 13px;
  outline: none;
  transition: border-color .15s;
  box-sizing: border-box;
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
  padding: 10px 13px;
  appearance: none;
  background: ${props => props.theme.colors.bg};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 9px;
  color: ${props => props.theme.colors.text};
  font-size: 13px;
  outline: none;
  transition: border-color .15s;
  box-sizing: border-box;
  color-scheme: ${props => props.theme.title};

  &:focus {
    border-color: ${props => props.theme.colors.accent};
  }

  option {
    background: ${props => props.theme.colors.s2};
    color: ${props => props.theme.colors.text};
  }
`;

export const TotalsBox = styled.div`
  background: ${props => props.theme.colors.s2};
  border-radius: 10px;
  padding: 12px 14px;
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: ${props => props.$discount ? props.theme.colors.red : props.theme.colors.muted};
`;

export const TotalRowMain = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 17px;
  font-weight: 800;
  color: ${props => props.theme.colors.text};
  padding-top: 8px;
  border-top: 1px solid ${props => props.theme.colors.border};
  margin-top: 2px;

  .accent {
    color: ${props => props.theme.colors.accent};
  }
`;

export const ErrorBox = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.red};
  line-height: 1.5;
  background: rgba(255,91,107,.08);
  border: 1px solid rgba(255,91,107,.25);
  border-radius: 9px;
  padding: 10px 14px;
`;

export const SubmitBtn = styled.button`
  padding: 14px;
  border-radius: 11px;
  border: none;
  font-weight: 800;
  font-size: 14px;
  letter-spacing: 0.2px;
  transition: all .2s;
  
  background: ${props => props.disabled ? props.theme.colors.s3 : `linear-gradient(135deg, ${props.theme.colors.accent}, ${props.theme.colors.accentD})`};
  color: ${props => props.disabled ? props.theme.colors.muted : '#051a12'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  box-shadow: ${props => props.disabled ? 'none' : `0 4px 18px ${props.theme.colors.accent}35`};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 22px ${props => props.theme.colors.accent}45;
  }
`;
