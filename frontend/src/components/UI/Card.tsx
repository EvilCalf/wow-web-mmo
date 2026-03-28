import styled from 'styled-components'

interface CardProps {
  $hoverable?: boolean
  $padding?: 'small' | 'medium' | 'large'
}

const Card = styled.div<CardProps>`
  background: rgba(26, 31, 58, 0.9);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  transition: all 0.3s;

  ${props => {
    switch (props.$padding) {
      case 'small':
        return 'padding: 16px;'
      case 'large':
        return 'padding: 32px;'
      default:
        return 'padding: 24px;'
    }
  }}

  ${props => props.$hoverable && `
    cursor: pointer;
    
    &:hover {
      transform: translateY(-4px);
      border-color: #f0b429;
      box-shadow: 0 8px 24px rgba(240, 180, 41, 0.2);
    }
  `}
`

export default Card
