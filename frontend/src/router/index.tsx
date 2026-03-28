import { createBrowserRouter, Navigate } from 'react-router-dom'
import { useAppSelector } from '@/store'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import CharacterSelect from '@/pages/CharacterSelect'
import Game from '@/pages/Game'
import Layout from '@/components/Layout'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAppSelector((state) => state.auth)
  
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

const GameRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentCharacter } = useAppSelector((state) => state.game)
  
  if (!currentCharacter) {
    return <Navigate to="/character-select" replace />
  }
  
  return children
}

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAppSelector((state) => state.auth)
  
  if (token) {
    return <Navigate to="/character-select" replace />
  }
  
  return children
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: 'login',
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        ),
      },
      {
        path: 'character-select',
        element: (
          <ProtectedRoute>
            <CharacterSelect />
          </ProtectedRoute>
        ),
      },
      {
        path: 'game',
        element: (
          <ProtectedRoute>
            <GameRoute>
              <Game />
            </GameRoute>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
])
