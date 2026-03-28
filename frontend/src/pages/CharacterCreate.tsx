import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchClasses } from '@/store/slices/gameSlice'
import { createCharacter } from '@/store/slices/characterSlice'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { Card } from '@/components/UI/Card'
import { Layout } from '@/components/Layout'

const CharacterCreate = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { classes, loading: classesLoading } = useAppSelector((state) => state.game)
  const { loading: createLoading } = useAppSelector((state) => state.characters)

  const [formData, setFormData] = useState({
    name: '',
    class: '',
    spec: '',
    faction: 'alliance' as 'alliance' | 'horde',
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    dispatch(fetchClasses())
  }, [isAuthenticated, navigate, dispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.class || !formData.name) {
      alert('请填写完整信息')
      return
    }
    const result = await dispatch(createCharacter(formData))
    if (createCharacter.fulfilled.match(result)) {
      navigate('/characters')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const selectedClass = classes.find((c: any) => c.id === formData.class)

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-amber-400">创建角色</h1>
              <p className="text-gray-400">创建您的魔兽世界英雄</p>
            </div>
            <Link to="/characters">
              <Button className="bg-gray-600 hover:bg-gray-700">
                返回
              </Button>
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Faction Selection */}
              <Card className="lg:col-span-2">
                <h3 className="text-xl font-bold text-white mb-4">选择阵营</h3>
                <div className="grid grid-cols-2 gap-4">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="faction"
                      value="alliance"
                      checked={formData.faction === 'alliance'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`p-6 rounded-lg border-2 transition-all ${
                      formData.faction === 'alliance'
                        ? 'border-blue-500 bg-blue-900/30'
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                    }`}>
                      <div className="text-center">
                        <div className="text-4xl mb-2">🏰</div>
                        <h4 className="text-xl font-bold text-blue-400">联盟</h4>
                        <p className="text-sm text-gray-400 mt-2">正义、荣耀、秩序</p>
                      </div>
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="faction"
                      value="horde"
                      checked={formData.faction === 'horde'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`p-6 rounded-lg border-2 transition-all ${
                      formData.faction === 'horde'
                        ? 'border-red-500 bg-red-900/30'
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                    }`}>
                      <div className="text-center">
                        <div className="text-4xl mb-2">🔥</div>
                        <h4 className="text-xl font-bold text-red-400">部落</h4>
                        <p className="text-sm text-gray-400 mt-2">力量、自由、荣耀</p>
                      </div>
                    </div>
                  </label>
                </div>
              </Card>

              {/* Class Selection */}
              <Card>
                <h3 className="text-xl font-bold text-white mb-4">选择职业</h3>
                {classesLoading ? (
                  <div className="text-center text-gray-400 py-8">加载中...</div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {classes.map((cls: any) => (
                      <label key={cls.id} className="cursor-pointer">
                        <input
                          type="radio"
                          name="class"
                          value={cls.id}
                          checked={formData.class === cls.id}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className={`p-3 rounded-lg border-2 transition-all text-center ${
                          formData.class === cls.id
                            ? 'border-amber-400 bg-amber-900/30'
                            : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                        }`}>
                          <div
                            className="w-10 h-10 mx-auto rounded-full mb-2 flex items-center justify-center text-lg font-bold"
                            style={{ backgroundColor: cls.color }}
                          >
                            {cls.name.charAt(0)}
                          </div>
                          <div className="text-sm font-medium" style={{ color: cls.color }}>
                            {cls.name}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </Card>

              {/* Class Details & Spec */}
              <Card>
                <h3 className="text-xl font-bold text-white mb-4">职业详情</h3>
                {selectedClass ? (
                  <div>
                    <p className="text-gray-300 mb-4">{selectedClass.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="text-lg font-medium text-white mb-2">专精</h4>
                      <div className="space-y-2">
                        {selectedClass.availableSpecs.map((spec: any) => (
                          <label key={spec.id} className="cursor-pointer block">
                            <input
                              type="radio"
                              name="spec"
                              value={spec.id}
                              checked={formData.spec === spec.id || (!formData.spec && selectedClass.availableSpecs[0]?.id === spec.id)}
                              onChange={(e) => {
                                setFormData({ ...formData, spec: e.target.value })
                              }}
                              className="sr-only"
                            />
                            <div className={`p-3 rounded-lg border-2 transition-all ${
                              (formData.spec === spec.id || (!formData.spec && selectedClass.availableSpecs[0]?.id === spec.id))
                                ? 'border-amber-400 bg-amber-900/30'
                                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                            }`}>
                              <div className="font-medium text-white">{spec.name}</div>
                              <div className="text-xs text-gray-400">
                                {spec.role === 'tank' ? '坦克' : spec.role === 'healer' ? '治疗' : spec.role === 'melee' ? '近战输出' : '远程输出'}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">基础属性</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">力量</span>
                          <span className="text-red-400">{selectedClass.stats.strength}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">敏捷</span>
                          <span className="text-green-400">{selectedClass.stats.agility}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">耐力</span>
                          <span className="text-yellow-400">{selectedClass.stats.stamina}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">智力</span>
                          <span className="text-blue-400">{selectedClass.stats.intellect}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">精神</span>
                          <span className="text-purple-400">{selectedClass.stats.spirit}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">请选择一个职业</p>
                )}
              </Card>

              {/* Character Name */}
              <Card className="lg:col-span-2">
                <h3 className="text-xl font-bold text-white mb-4">角色名称</h3>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="输入角色名称"
                  className="text-lg"
                  required
                />
              </Card>
            </div>

            {/* Submit */}
            <div className="mt-8 flex justify-center gap-4">
              <Link to="/characters">
                <Button type="button" className="bg-gray-600 hover:bg-gray-700">
                  取消
                </Button>
              </Link>
              <Button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 min-w-32"
                disabled={createLoading || !formData.class || !formData.name}
              >
                {createLoading ? '创建中...' : '创建角色'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default CharacterCreate
