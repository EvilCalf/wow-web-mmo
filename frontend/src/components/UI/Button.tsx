import styled from 'styled-components'

interface ButtonProps {
  $variant?: 'primary' | 'secondary' | 'danger' | 'success'
  $size?: 'small' | 'medium' | 'large'
  $fullWidth?: boolean
}

const Button = styled.button<ButtonProps>`
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #f0b429 0%, #d97706 100%);
          color: #1e293b;
          box-shadow: 0 4px 12px rgba(240, 180, 41, 0.3);
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(240, 180, 41, 0.4);
          }
        `
      case 'secondary':
        return `
          background: rgba(100, 116, 139, 0.2);
          color: #cbd5e1;
          border: 1px solid rgba(100, 116, 139, 0.3);
          
          &:hover:not(:disabled) {
            background: rgba(100, 116, 139, 0.3);
          }
        `
      case 'danger':
        return `
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
          }
        `
      case 'success':
        return `
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
          }
        `
      default:
        return ''
    }
  }}

  ${props => {
    switch (props.$size) {
      case 'small':
        return 'padding: 8px 16px; font-size: 14px;'
      case 'large':
        return 'padding: 16px 32px; font-size: 18px;'
      default:
        return 'padding: 12px 24px; font-size: 16px;'
    }
  }}

  ${props => props.$fullWidth && 'width: 100%;'}

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export default Button
