import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '@/store'
import { leaveGame } from '@/store/slices/gameSlice'
import gameEngine from '@/utils/gameEngine'
import { LogOut, Settings, MessageSquare, Map, Users, Backpack } from 'lucide-react'

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
`

const GameCanvas = styled.div`
  width: 100%;
  height: 100%;
`

const GameUI = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 100;
`

const TopBar = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: auto;
`

const PlayerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(0, 0, 0, 0.6);
  padding: 12px 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`

const PlayerName = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #f0b429;
`

const PlayerLevel = styled.div`
  font-size: 14px;
  color: #94a3b8;
`

const ResourceBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 200px;
`

const BarContainer = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
`

const HealthBar = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${props => props.$percent}%;
  background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
  transition: width 0.3s ease;
`

const ManaBar = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${props => props.$percent}%;
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  transition: width 0.3s ease;
`

const ActionBar = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 12px;
  pointer-events: auto;
`

const ActionButton = styled.button`
  width: 48px;
  height: 48px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(240, 180, 41, 0.2);
    border-color: #f0b429;
    color: #f0b429;
  }
`

const SkillBar = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  pointer-events: auto;
  backdrop-filter: blur(10px);
`

const SkillButton = styled.button<{ $cooldown?: number }>`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border: 2px solid rgba(240, 180, 41, 0.3);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: #f0b429;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(240, 180, 41, 0.3);
  }

  &::before {
    content: '${props => props.$cooldown || ''}';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: ${props => props.$cooldown ? 'flex' : 'none'};
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    color: #f0b429;
  }
`

const SkillKey = styled.span`
  position: absolute;
  top: 4px;
  left: 4px;
  font-size: 10px;
  background: rgba(0, 0, 0, 0.8);
  padding: 2px 6px;
  border-radius: 4px;
  color: #f0b429;
  font-weight: bold;
`

const ChatBox = styled.div`
  position: absolute;
  bottom: 30px;
  left: 20px;
  width: 350px;
  height: 200px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  backdrop-filter: blur(10px);
`

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 12px;
  font-size: 13px;
  line-height: 1.5;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(240, 180, 41, 0.5);
    border-radius: 3px;
  }
`

const ChatMessage = styled.div`
  margin-bottom: 8px;
  color: #cbd5e1;

  .sender {
    color: #f0b429;
    font-weight: bold;
    margin-right: 8px;
  }
`

const ChatInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(100, 116, 139, 0.3);
  border-radius: 6px;
  color: #ffffff;
  font-size: 13px;

  &:focus {
    outline: none;
    border-color: #f0b429;
  }
`

const ExitModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  z-index: 200;
`

const ExitModal = styled.div`
  background: rgba(26, 31, 58, 0.98);
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
`

const ModalTitle = styled.h2`
  margin: 0 0 16px 0;
  font-size: 24px;
  color: #f0b429;
`

const ModalText = styled.p`
  margin: 0 0 32px 0;
  color: #94a3b8;
  line-height: 1.6;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
`

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;

  ${props => props.$variant === 'primary' ? `
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: #ffffff;
  ` : `
    background: rgba(100, 116, 139, 0.2);
    color: #cbd5e1;
  `}

  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }
`

const SKILLS = [
  { id: 1, name: '火球术', key: '1', cooldown: 0 },
  { id: 2, name: '寒冰箭', key: '2', cooldown: 0 },
  { id: 3, name: '奥术飞弹', key: '3', cooldown: 0 },
  { id: 4, name: '闪现', key: '4', cooldown: 12 },
  { id: 5, name: '冰环', key: '5', cooldown: 0 },
  { id: 6, name: '变形术', key: '6', cooldown: 0 },
  { id: 7, name: '法力护盾', key: '7', cooldown: 0 },
  { id: 8, name: '灼烧', key: '8', cooldown: 0 },
  { id: 9, name: '炎爆术', key: '9', cooldown: 0 },
]

const MOCK_CHAT = [
  { id: 1, sender: '系统', message: '欢迎来到魔兽世界 Web MMO！' },
  { id: 2, sender: '阿尔萨斯', message: '为了联盟！' },
  { id: 3, sender: '吉安娜', message: '注意周围的怪物。' },
]

const Game = () => {
  const [showExitModal, setShowExitModal] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState(MOCK_CHAT)
  const gameContainerRef = useRef<HTMLDivElement>(null)
  
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { currentCharacter } = useAppSelector((state) => state.game)

  useEffect(() => {
    if (!currentCharacter || !gameContainerRef.current) return

    // 初始化游戏引擎
    gameEngine.init(gameContainerRef.current, currentCharacter)

    return () => {
      gameEngine.destroy()
    }
  }, [currentCharacter])

  const handleExit = () => {
    dispatch(leaveGame())
    navigate('/character-select')
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    setMessages([
      ...messages,
      { id: Date.now(), sender: currentCharacter?.name || '我', message: chatInput },
    ])
    setChatInput('')
  }

  const healthPercent = currentCharacter ? (currentCharacter.health / currentCharacter.maxHealth) * 100 : 100
  const manaPercent = currentCharacter ? (currentCharacter.mana / currentCharacter.maxMana) * 100 : 100

  return (
    <GameContainer>
      <GameCanvas ref={gameContainerRef} />
      
      <GameUI>
        <TopBar>
          <PlayerInfo>
            <div>
              <PlayerName>{currentCharacter?.name}</PlayerName>
              <PlayerLevel>等级 {currentCharacter?.level} {currentCharacter?.class}</PlayerLevel>
            </div>
            
            <ResourceBar>
              <BarContainer>
                <HealthBar $percent={healthPercent} />
              </BarContainer>
              <BarContainer>
                <ManaBar $percent={manaPercent} />
              </BarContainer>
            </ResourceBar>
          </PlayerInfo>

          <ActionBar>
            <ActionButton onClick={() => alert('打开背包')}>
              <Backpack size={20} />
            </ActionButton>
            <ActionButton onClick={() => alert('打开地图')}>
              <Map size={20} />
            </ActionButton>
            <ActionButton onClick={() => alert('打开社交')}>
              <Users size={20} />
            </ActionButton>
            <ActionButton onClick={() => alert('打开设置')}>
              <Settings size={20} />
            </ActionButton>
            <ActionButton onClick={() => setShowExitModal(true)}>
              <LogOut size={20} />
            </ActionButton>
          </ActionBar>
        </TopBar>

        <SkillBar>
          {SKILLS.map((skill) => (
            <SkillButton key={skill.id} $cooldown={skill.cooldown}>
              <SkillKey>{skill.key}</SkillKey>
              {skill.name}
            </SkillButton>
          ))}
        </SkillBar>

        <ChatBox>
          <ChatMessages>
            {messages.map((msg) => (
              <ChatMessage key={msg.id}>
                <span className="sender">[{msg.sender}]:</span>
                {msg.message}
              </ChatMessage>
            ))}
          </ChatMessages>
          
          <form onSubmit={handleChatSubmit}>
            <ChatInput
              type="text"
              placeholder="输入消息..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
          </form>
        </ChatBox>
      </GameUI>

      {showExitModal && (
        <ExitModalOverlay>
          <ExitModal>
            <ModalTitle>退出游戏</ModalTitle>
            <ModalText>确定要返回角色选择界面吗？当前游戏进度会自动保存。</ModalText>
            
            <ButtonGroup>
              <Button $variant="secondary" onClick={() => setShowExitModal(false)}>
                取消
              </Button>
              <Button $variant="primary" onClick={handleExit}>
                确认退出
              </Button>
            </ButtonGroup>
          </ExitModal>
        </ExitModalOverlay>
      )}
    </GameContainer>
  )
}

export default Game
