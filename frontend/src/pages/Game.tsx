import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchDungeons, startPVEBattle, executeSkill, claimRewards, clearBattle, fetchBattle } from '@/store/slices/gameSlice'
import { fetchCharacter } from '@/store/slices/characterSlice'
import { Button } from '@/components/UI/Button'
import { Card } from '@/components/UI/Card'
import { Layout } from '@/components/Layout'

const Game = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { currentCharacter } = useAppSelector((state) => state.characters)
  const { dungeons, battle, loading } = useAppSelector((state) => state.game)

  const [selectedDungeon, setSelectedDungeon] = useState<string | null>(null)
  const [polling, setPolling] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (!currentCharacter) {
      navigate('/characters')
      return
    }
    dispatch(fetchDungeons())
    if (currentCharacter.id) {
      dispatch(fetchCharacter(currentCharacter.id))
    }
  }, [isAuthenticated, navigate, dispatch, currentCharacter])

  useEffect(() => {
    if (battle && !battle.isOver && battle.currentActorId && !battle.actors.find(a => a.id === battle.currentActorId)?.isPlayer) {
      // 非玩家回合，自动轮询
      setPolling(true)
      const interval = setInterval(() => {
        if (battle?.id) {
          dispatch(fetchBattle(battle.id))
        }
      }, 1000)
      
      return () => {
        clearInterval(interval)
        setPolling(false)
      }
    }
  }, [battle, dispatch])

  const handleStartBattle = (dungeonId: string) => {
    if (currentCharacter?.id) {
      dispatch(startPVEBattle({ characterId: currentCharacter.id, dungeonId }))
    }
  }

  const handleExecuteSkill = (skillId: string, targetId: string) => {
    if (battle?.id && currentCharacter?.id) {
      dispatch(executeSkill({
        battleId: battle.id,
        actorId: 'player',
        skillId,
        targetId,
      }))
    }
  }

  const handleClaimRewards = () => {
    if (battle?.id && currentCharacter?.id) {
      dispatch(claimRewards({ battleId: battle.id, characterId: currentCharacter.id }))
        .then(() => {
          dispatch(clearBattle())
          if (currentCharacter?.id) {
            dispatch(fetchCharacter(currentCharacter.id))
          }
        })
    }
  }

  const getClassColor = (classId: string) => {
    const colors: Record<string, string> = {
      warrior: '#C79C6E',
      paladin: '#F58CBA',
      hunter: '#ABD473',
      rogue: '#FFF569',
      priest: '#FFFFFF',
      death_knight: '#C41F3B',
      shaman: '#0070DE',
      mage: '#69CCF0',
      warlock: '#9482C9',
      monk: '#00FF96',
    }
    return colors[classId] || '#ffffff'
  }

  const getHealthPercent = (current: number, max: number) => {
    return Math.max(0, Math.min(100, (current / max) * 100))
  }

  const isPlayerTurn = battle && !battle.isOver && battle.currentActorId === 'player'

  if (battle) {
    const player = battle.actors.find(a => a.isPlayer)
    const enemies = battle.actors.filter(a => !a.isPlayer)
    const targetEnemy = enemies.find(e => e.health > 0) || enemies[0]

    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-4">
          <div className="max-w-6xl mx-auto">
            {/* Battle Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-amber-400">怒焰裂谷</h1>
                <p className="text-gray-400">回合 {battle.turn}</p>
              </div>
              {battle.isOver && (
                <Button onClick={() => dispatch(clearBattle())} className="bg-gray-600">
                  返回
                </Button>
              )}
            </div>

            {/* Battle Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Player Side */}
              <Card className="lg:col-span-1">
                <h3 className="text-lg font-bold text-white mb-4">我方</h3>
                {player && (
                  <div className="p-4 rounded-lg bg-gray-800/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                        style={{ backgroundColor: getClassColor(player.class || '') }}
                      >
                        {player.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white">{player.name}</div>
                        <div className="text-sm text-gray-400">
                          等级 {player.level}
                        </div>
                      </div>
                    </div>
                    
                    {/* Health Bar */}
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-red-400">生命值</span>
                        <span className="text-white">{player.health} / {player.maxHealth}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-4">
                        <div
                          className="bg-red-500 h-4 rounded-full transition-all"
                          style={{ width: `${getHealthPercent(player.health, player.maxHealth)}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Resource Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-blue-400">
                          {player.resourceType === 'rage' ? '怒气' : player.resourceType === 'energy' ? '能量' : player.resourceType === 'focus' ? '集中值' : '法力值'}
                        </span>
                        <span className="text-white">{player.resource} / {player.maxResource}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            player.resourceType === 'rage' ? 'bg-red-600' :
                            player.resourceType === 'energy' ? 'bg-yellow-500' :
                            player.resourceType === 'focus' ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${(player.resource / player.maxResource) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              {/* Battle Log */}
              <Card className="lg:col-span-1">
                <h3 className="text-lg font-bold text-white mb-4">战斗日志</h3>
                <div className="h-64 overflow-y-auto space-y-2">
                  {battle.logs.slice(-20).reverse().map((log, index) => (
                    <div key={index} className="text-sm text-gray-300">
                      {log.message}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Enemy Side */}
              <Card className="lg:col-span-1">
                <h3 className="text-lg font-bold text-white mb-4">敌方</h3>
                {enemies.filter(e => e.health > 0).map((enemy) => (
                  <div key={enemy.id} className="p-4 rounded-lg bg-red-900/30 mb-3">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-lg font-bold">
                        {enemy.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white">{enemy.name}</div>
                        <div className="text-sm text-gray-400">
                          等级 {enemy.level}
                        </div>
                      </div>
                    </div>
                    
                    {/* Health Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-red-400">生命值</span>
                        <span className="text-white">{enemy.health} / {enemy.maxHealth}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-4">
                        <div
                          className="bg-red-500 h-4 rounded-full transition-all"
                          style={{ width: `${getHealthPercent(enemy.health, enemy.maxHealth)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {enemies.filter(e => e.health > 0).length === 0 && enemies.length > 0 && (
                  <div className="text-center text-gray-400 py-8">
                    所有敌人已被击败！
                  </div>
                )}
              </Card>
            </div>

            {/* Battle Result */}
            {battle.isOver && (
              <Card className="mb-6 text-center py-8">
                <h2 className={`text-3xl font-bold mb-4 ${
                  battle.winner === 'player' ? 'text-amber-400' : 'text-red-500'
                }`}>
                  {battle.winner === 'player' ? '胜利！' : '失败...'}
                </h2>
                {battle.rewards && (
                  <div className="mt-4">
                    <p className="text-gray-300 mb-2">战斗奖励：</p>
                    <p className="text-amber-400">经验值：+{battle.rewards.experience}</p>
                    <p className="text-yellow-400">金币：+{battle.rewards.gold}</p>
                  </div>
                )}
                {battle.winner === 'player' && (
                  <Button
                    onClick={handleClaimRewards}
                    className="mt-6 bg-amber-600 hover:bg-amber-700"
                  >
                    领取奖励
                  </Button>
                )}
              </Card>
            )}

            {/* Skills */}
            {!battle.isOver && (
              <Card>
                <h3 className="text-lg font-bold text-white mb-4">
                  {isPlayerTurn ? '选择技能' : '等待对手行动...'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    onClick={() => targetEnemy && handleExecuteSkill('auto_attack', targetEnemy.id)}
                    disabled={!isPlayerTurn || !targetEnemy}
                    className="bg-gray-600 hover:bg-gray-700"
                  >
                    普通攻击
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-amber-400">魔兽世界</h1>
              <p className="text-gray-400">选择您的冒险</p>
            </div>
            <button
              onClick={() => navigate('/characters')}
              className="text-gray-400 hover:text-white"
            >
              返回角色选择
            </button>
          </div>

          {/* Character Info */}
          {currentCharacter && (
            <Card className="mb-8">
              <div className="flex items-center gap-6">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold"
                  style={{ backgroundColor: getClassColor(currentCharacter.class) }}
                >
                  {currentCharacter.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">{currentCharacter.name}</h2>
                  <p className="text-gray-400">
                    等级 {currentCharacter.level} | {currentCharacter.class}
                  </p>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">经验值</span>
                      <span className="text-amber-400">
                        {currentCharacter.experience} / {currentCharacter.level * 1000}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-amber-400 h-3 rounded-full"
                        style={{ width: `${Math.min(100, (currentCharacter.experience / (currentCharacter.level * 1000)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-red-400 font-bold">{currentCharacter.stats.health}</div>
                    <div className="text-gray-400">生命值</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-400 font-bold">{currentCharacter.stats.mana}</div>
                    <div className="text-gray-400">法力值</div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Dungeons */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">副本</h2>
            {loading ? (
              <div className="text-center text-gray-400 py-8">加载中...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dungeons.map((dungeon: any) => {
                  const canEnter = currentCharacter &&
                    currentCharacter.level >= dungeon.minLevel &&
                    currentCharacter.level <= dungeon.maxLevel

                  return (
                    <Card
                      key={dungeon.id}
                      className={`cursor-pointer transition-all ${
                        selectedDungeon === dungeon.id ? 'border-amber-400' : ''
                      } ${!canEnter ? 'opacity-50' : 'hover:border-gray-500'}`}
                      onClick={() => canEnter && setSelectedDungeon(dungeon.id)}
                    >
                      <h3 className="text-xl font-bold text-white mb-2">{dungeon.name}</h3>
                      <p className="text-gray-400 text-sm mb-3">{dungeon.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">
                          等级 {dungeon.minLevel} - {dungeon.maxLevel}
                        </span>
                        <span className="text-sm text-gray-400">{dungeon.location}</span>
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        BOSS: {dungeon.bosses?.join(', ')}
                      </div>
                      {selectedDungeon === dungeon.id && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleStartBattle(dungeon.id)
                          }}
                          className="w-full mt-4 bg-amber-600 hover:bg-amber-700"
                        >
                          进入副本
                        </Button>
                      )}
                      {!canEnter && (
                        <div className="mt-3 text-sm text-red-400">
                          等级不足，无法进入
                        </div>
                      )}
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Game
