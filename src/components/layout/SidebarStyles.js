import styled from 'styled-components'

export const Aside = styled.aside`
  width: ${props => props.$isOpen ? '220px' : '0'};
  flex-shrink: 0;
  background: ${props => props.theme.colors.surface};
  border-right: ${props => props.$isOpen ? `1px solid ${props.theme.colors.border}` : 'none'};
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: ${props => props.$isOpen ? 'auto' : 'hidden'};
  transition: transform .25s ease, width .25s ease;

  @media (max-width: 767px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 50;
    width: 220px; /* fixed width on mobile */
    transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    box-shadow: ${props => props.$isOpen ? '4px 0 24px rgba(0,0,0,0.5)' : 'none'};
    border-right: 1px solid ${props => props.theme.colors.border};
  }

  @media print { display: none !important; }
`

export const BrandArea = styled.div`
  padding: 24px 20px 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`

export const BrandSystem = styled.div`
  font-size: 10px;
  color: ${props => props.theme.colors.accent};
  font-family: monospace;
  letter-spacing: 3px;
  margin-bottom: 6px;
`

export const BrandTitle = styled.div`
  font-size: 16px;
  font-weight: 800;
  color: ${props => props.theme.colors.text};
  letter-spacing: -0.5px;
  line-height: 1.2;

  span {
    color: ${props => props.theme.colors.accent};
  }
`

export const BrandVersion = styled.div`
  font-size: 10px;
  color: ${props => props.theme.colors.muted};
  margin-top: 6px;
  font-family: monospace;
`

export const NavArea = styled.nav`
  padding: 12px 10px;
  flex: 1;
`

export const NavItemBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: none;
  background: ${props => props.$active ? 'rgba(0,217,168,.1)' : 'none'};
  color: ${props => props.$locked ? props.theme.colors.muted : props.$active ? props.theme.colors.accent : props.theme.colors.muted2};
  font-size: 13px;
  font-weight: ${props => props.$active ? 700 : 500};
  cursor: ${props => props.$locked ? 'not-allowed' : 'pointer'};
  text-align: left;
  margin-bottom: 2px;
  transition: background .15s;

  span {
    flex: 1;
  }
`

export const NavBadge = styled.span`
  font-size: 9px;
  padding: 2px 6px;
  border-radius: 4px;
  background: ${props => props.theme.colors.s3};
  color: ${props => props.theme.colors.muted};
  font-family: monospace;
`

export const UserArea = styled.div`
  padding: 14px 12px;
  border-top: 1px solid ${props => props.theme.colors.border};
`

export const UserCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  background: ${props => props.theme.colors.s2};
`

export const UserAvatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: rgba(0,217,168,.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: ${props => props.theme.colors.accent};
  flex-shrink: 0;
`

export const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`

export const UserName = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const UserRole = styled.div`
  font-size: 10px;
  color: ${props => props.theme.colors.muted};
  text-transform: capitalize;
`

export const LogoutBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.muted};
  flex-shrink: 0;
  transition: color 0.15s;

  &:hover {
    color: ${props => props.theme.colors.red};
  }
`
