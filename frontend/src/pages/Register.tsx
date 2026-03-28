import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '@/store'
import { register, clearError } from '@/store/slices/authSlice'
import { User, Lock, Mail, AlertCircle } from 'lucide-react'

const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
`

const RegisterCard = styled.div`
  background: rgba(26, 31, 58, 0.9);
  border-radius: 16px;
  padding: 48px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
  max-width: 420px;
  backdrop-filter: blur(10px);
`

const Title = styled.h1`
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #f0b429;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`

const Subtitle = styled.p`
  text-align: center;
  color: #94a3b8;
  margin-bottom: 32px;
  font-size: 14px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const InputGroup = styled.div`
  position: relative;
`

const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
`

const Input = styled.input`
  width: 100%;
  padding: 16px 16px 16px 48px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(100, 116, 139, 0.3);
  border-radius: 8px;
  color: #ffffff;
  font-size: 16px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #f0b429;
    box-shadow: 0 0 0 3px rgba(240, 180, 41, 0.1);
  }

  &::placeholder {
    color: #64748b;
  }
`

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 12px;
  color: #fca5a5;
  font-size: 14px;
`

const Button = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #f0b429 0%, #d97706 100%);
  border: none;
  border-radius: 8px;
  color: #1e293b;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(240, 180, 41, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(240, 180, 41, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const Footer = styled.div`
  text-align: center;
  margin-top: 24px;
  color: #94a3b8;
  font-size: 14px;
`

const StyledLink = styled(Link)`
  color: #f0b429;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)

    if (password !== confirmPassword) {
      setPasswordError('两次输入的密码不一致')
      return
    }

    if (password.length < 6) {
      setPasswordError('密码长度至少为6位')
      return
    }

    try {
      await dispatch(register({ username, email, password })).unwrap()
      navigate('/character-select')
    } catch (err) {
      console.error('Registration failed:', err)
    }
  }

  return (
    <RegisterContainer>
      <RegisterCard>
        <Title>魔兽世界</Title>
        <Subtitle>创建你的账号</Subtitle>
        
        <Form onSubmit={handleSubmit}>
          {error && (
            <ErrorMessage>
              <AlertCircle size={16} />
              {error}
            </ErrorMessage>
          )}
          
          {passwordError && (
            <ErrorMessage>
              <AlertCircle size={16} />
              {passwordError}
            </ErrorMessage>
          )}
          
          <InputGroup>
            <InputIcon>
              <User size={20} />
            </InputIcon>
            <Input
              type="text"
              placeholder="用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <Mail size={20} />
            </InputIcon>
            <Input
              type="email"
              placeholder="邮箱地址"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <Lock size={20} />
            </InputIcon>
            <Input
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <Lock size={20} />
            </InputIcon>
            <Input
              type="password"
              placeholder="确认密码"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </InputGroup>

          <Button type="submit" disabled={loading}>
            {loading ? '注册中...' : '注册'}
          </Button>
        </Form>

        <Footer>
          已有账号？ <StyledLink to="/login">立即登录</StyledLink>
        </Footer>
      </RegisterCard>
    </RegisterContainer>
  )
}

export default Register
