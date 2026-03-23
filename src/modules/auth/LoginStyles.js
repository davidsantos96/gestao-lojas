import styled, { keyframes } from 'styled-components'

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20%  { transform: translateX(-10px); }
  40%  { transform: translateX(10px); }
  60%  { transform: translateX(-6px); }
  80%  { transform: translateX(6px); }
`

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`

const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50%      { opacity: 0.6; transform: scale(1.05); }
`

export const LoginWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${props => props.theme.colors.bg};
  position: relative;
  overflow: hidden;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
`

export const BgGlow = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, ${props => props.theme.colors.accent}22 0%, transparent 70%);
  top: -10%;
  right: -5%;
  animation: ${pulse} 6s ease-in-out infinite;
  pointer-events: none;
`

export const BgGlow2 = styled.div`
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, ${props => props.theme.colors.blue}18 0%, transparent 70%);
  bottom: -10%;
  left: -5%;
  animation: ${pulse} 8s ease-in-out infinite;
  pointer-events: none;
`

export const LoginCard = styled.form`
  position: relative;
  z-index: 1;
  width: 400px;
  padding: 44px 36px 32px;
  border-radius: 20px;
  background: linear-gradient(145deg, ${props => props.theme.colors.surface}ee, ${props => props.theme.colors.s2}dd);
  border: 1px solid ${props => props.theme.colors.border};
  backdrop-filter: blur(20px);
  box-shadow: 0 24px 80px rgba(0,0,0,.5), 0 0 0 1px ${props => props.theme.colors.border};
  animation: ${props => props.$shake ? `${shake} 0.5s ease-in-out` : `${fadeIn} 0.6s ease-out`};
`

export const LogoWrap = styled.div`
  text-align: center;
  margin-bottom: 28px;
`

export const LogoCircle = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: ${props => props.theme.colors.accent}18;
  border: 1px solid ${props => props.theme.colors.accent}30;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  letter-spacing: -0.5px;
  margin: 0 0 6px;
`

export const Subtitle = styled.p`
  font-size: 13px;
  color: ${props => props.theme.colors.muted};
  margin: 0;
`

export const ErrorBoxLogin = styled.div`
  background: ${props => props.theme.colors.red}15;
  border: 1px solid ${props => props.theme.colors.red}30;
  border-radius: 10px;
  padding: 10px 14px;
  color: ${props => props.theme.colors.red};
  margin-bottom: 16px;
  text-align: center;
  font-size: 13px;
`

export const FieldWrap = styled.div`
  margin-bottom: 18px;
`

export const Label = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.colors.muted2};
  margin-bottom: 6px;
  letter-spacing: 0.3px;
`

export const InputWrap = styled.div`
  position: relative;
`

export const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  padding-right: ${props => props.$hasIcon ? '44px' : '14px'};
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.s3};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;

  &:focus {
    border-color: ${props => props.theme.colors.accent};
  }
`

export const EyeBtn = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
`

export const SubmitBtn = styled.button`
  width: 100%;
  padding: 13px 0;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.bg};
  background: linear-gradient(135deg, ${props => props.theme.colors.accent}, ${props => props.theme.colors.accentD});
  border: none;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: opacity 0.15s, transform 0.15s;
  margin-top: 6px;
  opacity: ${props => props.disabled ? 0.7 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};

  svg {
    animation: ${props => props.$loading ? `${spin} 0.8s linear infinite` : 'none'};
  }
`

export const FooterText = styled.p`
  text-align: center;
  font-size: 11px;
  color: ${props => props.theme.colors.muted};
  margin-top: 24px;
  margin-bottom: 0;
`
