import { createBrowserRouter } from 'react-router-dom'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import CharacterSelect from '@/pages/CharacterSelect'
import CharacterCreate from '@/pages/CharacterCreate'
import Game from '@/pages/Game'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/characters',
    element: <CharacterSelect />,
  },
  {
    path: '/character/create',
    element: <CharacterCreate />,
  },
  {
    path: '/game',
    element: <Game />,
  },
])
