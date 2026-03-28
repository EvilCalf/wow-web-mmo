import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store, useAppDispatch } from '@/store'
import { router } from '@/router'
import { getCurrentUser } from '@/store/slices/authSlice'
import '@/styles/global.css'

const AppInitializer = () => {
  const dispatch = useAppDispatch()
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (token) {
      dispatch(getCurrentUser())
    }
  }, [dispatch, token])

  return <RouterProvider router={router} />
}

const App = () => {
  return (
    <Provider store={store}>
      <AppInitializer />
    </Provider>
  )
}

export default App
