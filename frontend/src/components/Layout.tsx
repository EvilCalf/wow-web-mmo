import { Outlet } from 'react-router-dom'
import styled from 'styled-components'

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(to bottom, #0a0e27, #1a1f3a);
  font-family: 'Arial', sans-serif;
  color: #ffffff;
`

const Layout = () => {
  return (
    <AppContainer>
      <Outlet />
    </AppContainer>
  )
}

export default Layout
