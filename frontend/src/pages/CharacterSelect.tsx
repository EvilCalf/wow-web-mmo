import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchCharacters, setCurrentCharacter } from '@/store/slices/characterSlice'
import { fetchClasses } from '@/store/slices/gameSlice'
import { logout } from '@/store/slices/authSlice'
import { Button } from '@/components/UI/Button'
import { Card } from '@/components/UI/Card'
import { Layout } from '@/components/Layout'

const CharacterSelect = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const { characters, loading } = useAppSelector((state) => state.characters)
  const { classes } = useAppSelector((state) => state.game)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    dispatch(fetchCharacters())
    dispatch(fetchClasses())
  }, [isAuthenticated, navigate, dispatch])

  const handleSelectCharacter = (character: any) => {
    dispatch(setCurrentCharacter(character))
    navigate('/game')
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const getClassColor = (classId: string) => {
    const cls = classes.find((c: any) => c.id === classId)
    return cls?.color || '#ffffff'
  }

  const getClassName = (classId: string) => {
    const cls = classes.find((c: any) => c.id === classId)
    return cls?.name || classId
  }

  const getFactionName = (faction: string) => {
    return faction === 'alliance' ? '联盟' : '部落'
  }

  const getFactionColor = (faction: string) => {
    return faction === 'alliance' ? '#0070dd' : '#c41e3a'
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-amber-400">魔兽世界</h1>
              <p className="text-gray-400">欢迎回来，{user?.username}</p>
            </div>
            <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
              退出登录
            </Button>
          </div>

          {/* Characters */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">选择角色</h2>
              <Link to="/character/create">
                <Button className="bg-green-600 hover:bg-green-700">
                  创建新角色
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="text-center text-gray-400 py-8">加载中...</div>
            ) : characters.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-gray-400 mb-4">您还没有创建角色</p>
                <Link to="/character/create">
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    创建第一个角色
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {characters.map((character: any) => (
                  <Card
                    key={character.id}
                    className="cursor-pointer hover:border-amber-400 transition-colors"
                    onClick={() => handleSelectCharacter(character)}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
                        style={{ backgroundColor: getClassColor(character.class) }}
                      >
                        {getClassName(character.class).charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white">{character.name}</h3>
                        <p className="text-sm" style={{ color: getClassColor(character.class) }}>
                          {getClassName(character.class)}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <span
                            className="text-xs px-2 py-1 rounded"
                            style={{ backgroundColor: getFactionColor(character.faction) }}
                          >
                            {getFactionName(character.faction)}
                          </span>
                          <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300">
                            等级 {character.level}
                          </span>
                        </div>
                        <div className="mt-2">
                          <div className="text-xs text-gray-400">
                            经验: {character.experience} / {character.level * 1000}
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                            <div
                              className="bg-amber-400 h-2 rounded-full"
                              style={{ width: `${Math.min(100, (character.experience / (character.level * 1000)) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CharacterSelect
