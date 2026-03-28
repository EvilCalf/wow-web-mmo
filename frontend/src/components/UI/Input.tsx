import styled from 'styled-components'

interface InputProps {
  $hasError?: boolean
}

const Input = styled.input<InputProps>`
  width: 100%;
  padding: 16px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid ${props => props.$hasError ? 'rgba(239, 68, 68, 0.5)' : 'rgba(100, 116, 139, 0.3)'};
  border-radius: 8px;
  color: #ffffff;
  font-size: 16px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#ef4444' : '#f0b429'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(240, 180, 41, 0.1)'};
  }

  &::placeholder {
    color: #64748b;
  }
`

export default Input
