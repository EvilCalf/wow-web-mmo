import { useEffect, useCallback } from 'react'
import { useAppDispatch } from '@/store'
import { updateCharacterPosition } from '@/store/slices/gameSlice'

interface KeyState {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
}

const useGameControls = () => {
  const dispatch = useAppDispatch()

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'w':
      case 'ArrowUp':
        // 向上移动
        dispatch(updateCharacterPosition({ x: 0, y: -10 }))
        break
      case 's':
      case 'ArrowDown':
        // 向下移动
        dispatch(updateCharacterPosition({ x: 0, y: 10 }))
        break
      case 'a':
      case 'ArrowLeft':
        // 向左移动
        dispatch(updateCharacterPosition({ x: -10, y: 0 }))
        break
      case 'd':
      case 'ArrowRight':
        // 向右移动
        dispatch(updateCharacterPosition({ x: 10, y: 0 }))
        break
      case 'Escape':
        // 打开菜单
        break
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        // 技能快捷键
        console.log('使用技能:', e.key)
        break
    }
  }, [dispatch])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return null
}

export default useGameControls
