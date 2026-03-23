import { useState, useContext } from 'react'
import { ThemeContext } from '../../contexts/ThemeContext'
import { useAuth } from '../../hooks/useAuth'
import { Store, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react'
import {
  LoginWrapper, BgGlow, BgGlow2, LoginCard, LogoWrap, LogoCircle, Title, Subtitle,
  ErrorBoxLogin, FieldWrap, Label, InputWrap, Input, EyeBtn, SubmitBtn, FooterText
} from './LoginStyles'

export function LoginPage() {
  const { login, error } = useAuth()
  const { theme } = useContext(ThemeContext)
  const [email, setEmail]   = useState('')
  const [senha, setSenha]   = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, senha)
    } catch {
      setShake(true)
      setTimeout(() => setShake(false), 600)
    } finally {
      setLoading(false)
    }
  }

  return (
    <LoginWrapper>
      {/* Background animated gradient */}
      <BgGlow />
      <BgGlow2 />

      <LoginCard
        onSubmit={handleSubmit}
        $shake={shake}
      >
        {/* Logo */}
        <LogoWrap>
          <LogoCircle>
            <Store size={28} color={theme.colors.accent} />
          </LogoCircle>
          <Title>Gestão Lojas</Title>
          <Subtitle>Acesse sua conta para continuar</Subtitle>
        </LogoWrap>

        {/* Error */}
        {error && (
          <ErrorBoxLogin>
            <span>⚠️ {error}</span>
          </ErrorBoxLogin>
        )}

        {/* Email */}
        <FieldWrap>
          <Label htmlFor="login-email">Email</Label>
          <InputWrap>
            <Input
              id="login-email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </InputWrap>
        </FieldWrap>

        {/* Senha */}
        <FieldWrap>
          <Label htmlFor="login-senha">Senha</Label>
          <InputWrap>
            <Input
              id="login-senha"
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
              minLength={4}
              $hasIcon
            />
            <EyeBtn
              type="button"
              onClick={() => setShowPw(!showPw)}
              tabIndex={-1}
            >
              {showPw ? <EyeOff size={16} color={theme.colors.muted} /> : <Eye size={16} color={theme.colors.muted} />}
            </EyeBtn>
          </InputWrap>
        </FieldWrap>

        {/* Submit */}
        <SubmitBtn
          id="login-submit"
          type="submit"
          disabled={loading}
          $loading={loading}
        >
          {loading ? <Loader2 size={18} /> : <LogIn size={18} />}
          {loading ? 'Entrando...' : 'Entrar'}
        </SubmitBtn>

        {/* Footer */}
        <FooterText>
          Sistema de Controle de Lojas · v0.1
        </FooterText>
      </LoginCard>
    </LoginWrapper>
  )
}
