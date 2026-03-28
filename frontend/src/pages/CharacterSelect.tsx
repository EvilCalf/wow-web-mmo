import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '@/store'
import { getCharacters, createCharacter, selectCharacter, enterGame } from '@/store/slices/gameSlice'
import { logout } from '@/store/slices/authSlice'
import { Plus, LogOut, Sword, Shield, Heart, AlertCircle } from 'lucide-react'

const CharacterSelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 40px;
`

const Title = styled.h1`
  font-size: 48px;
  font-weight: bold;
  color: #f0b429;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  margin: 0;
`

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #fca5a5;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(239, 68, 68, 0.2);
  }
`

const Content = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 40px;
`

const CharacterCard = styled.div`
  background: rgba(26, 31, 58, 0.9);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateY(-4px);
    border-color: #f0b429;
    box-shadow: 0 8px 24px rgba(240, 180, 41, 0.2);
  }
`

const CharacterHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`

const CharacterAvatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f0b429 0%, #d97706 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: #1e293b;
`

const CharacterInfo = styled.div`
  flex: 1;
`

const CharacterName = styled.h3`
  margin: 0 0 4px 0;
  font-size: 20px;
  color: #ffffff;
`

const CharacterClass = styled.p`
  margin: 0;
  font-size: 14px;
  color: #94a3b8;
`

const CharacterStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
`

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #cbd5e1;
`

const PlayButton = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
`

const CreateCard = styled.div`
  background: rgba(26, 31, 58, 0.5);
  border-radius: 16px;
  padding: 48px 24px;
  border: 2px dashed rgba(100, 116, 139, 0.3);
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;

  &:hover {
    border-color: #f0b429;
    background: rgba(26, 31, 58, 0.7);
  }
`

const CreateIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(240, 180, 41, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f0b429;
`

const CreateText = styled.p`
  margin: 0;
  font-size: 18px;
  color: #94a3b8;
  font-weight: 500;
`

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const Modal = styled.div`
  background: rgba(26, 31, 58, 0.98);
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 500px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 16px 64px rgba(0, 0, 0, 0.6);
`

const ModalTitle = styled.h2`
  margin: 0 0 24px 0;
  font-size: 28px;
  color: #f0b429;
  text-align: center;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const Input = styled.input`
  width: 100%;
  padding: 16px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(100, 116, 139, 0.3);
  border-radius: 8px;
  color: #ffffff;
  font-size: 16px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #f0b429;
    box-shadow: 0 0 0 3px rgba(240, 180, 41, 0.1);
  }
`

const Select = styled.select`
  width: 100%;
  padding: 16px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(100, 116, 139, 0.3);
  border-radius: 8px;
  color: #ffffff;
  font-size: 16px;
  transition: all 0.2s;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #f0b429;
    box-shadow: 0 0 0 3px rgba(240, 180, 41, 0.1);
  }

  option {
    background: #1e293b;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
`

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 16px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;

  ${props => props.$variant === 'primary' ? `
    background: linear-gradient(135deg, #f0b429 0%, #d97706 100%);
    color: #1e293b;
  ` : `
    background: rgba(100, 116, 139, 0.2);
    color: #cbd5e1;
  `}

  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 12px;
  color: #fca5a5;
  font-size: 14px;
`

const CLASSES = [
  '战士', '法师', '牧师', '盗贼', '猎人', '萨满', '圣骑士', '德鲁伊', '术士', '武僧', '死亡骑士', '恶魔猎手'
]

const RACES = [
  '人类', '矮人', '暗夜精灵', '侏儒', '德莱尼', '狼人', '熊猫人',
  '兽人', '巨魔', '牛头人', '被遗忘者', '血精灵', '地精'
]

const CharacterSelect = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newCharacter, setNewCharacter] = useState({
    name: '',
    class: CLASSES[0],
    race: RACES[0],
  })
  
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { currentCharacter, loading, error } = useAppSelector((state) => state.game)
  const { user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getCharacters())
  }, [dispatch])

  const handleCreateCharacter = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await dispatch(createCharacter(newCharacter)).unwrap()
      setShowCreateModal(false)
      setNewCharacter({ name: '', class: CLASSES[0], race: RACES[0] })
      dispatch(getCharacters())
    } catch (err) {
      console.error('Failed to create character:', err)
    }
  }

  const handlePlay = async (characterId: string) => {
    try {
      await dispatch(selectCharacter(characterId)).unwrap()
      dispatch(enterGame())
      navigate('/game')
    } catch (err) {
      console.error('Failed to select character:', err)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  // 临时模拟角色数据，实际项目中会从API获取
  const mockCharacters = [
    {
      id: '1',
      name: '阿尔萨斯',
      class: '死亡骑士',
      race: '人类',
      level: 80,
      health: 10000,
      maxHealth: 10000,
      mana: 5000,
      maxMana: 5000,
      position: { x: 0, y: 0, map: 'world' },
      equipment: [],
      inventory: [],
      spells: [],
    },
    {
      id: '2',
      name: '吉安娜',
      class: '法师',
      race: '人类',
      level: 80,
      health: 6000,
      maxHealth: 6000,
      mana: 12000,
      maxMana: 12000,
      position: { x: 0, y: 0, map: 'world' },
      equipment: [],
      inventory: [],
      spells: [],
    },
  ]

  return (
    <CharacterSelectContainer>
      <Header>
        <Title>选择角色</Title>
        <LogoutButton onClick={handleLogout}>
          <LogOut size={16} />
          退出登录
        </LogoutButton>
      </Header>

      {error && (
        <ErrorMessage style={{ marginBottom: '24px' }}>
          <AlertCircle size={16} />
          {error}
        </ErrorMessage>
      )}

      <Content>
        {mockCharacters.map((char) => (
          <CharacterCard key={char.id}>
            <CharacterHeader>
              <CharacterAvatar>
                {char.name.charAt(0)}
              </CharacterAvatar>
              <CharacterInfo>
                <CharacterName>{char.name}</CharacterName>
                <CharacterClass>{char.race} · {char.class} · 等级 {char.level}</CharacterClass>
              </CharacterInfo>
            </CharacterHeader>
            
            <CharacterStats>
              <StatItem>
                <Heart size={16} color="#ef4444" />
                {char.health} / {char.maxHealth}
              </StatItem>
              <StatItem>
                <Sword size={16} color="#f0b429" />
                攻击: 1200
              </StatItem>
              <StatItem>
                <Shield size={16} color="#3b82f6" />
                防御: 800
              </StatItem>
            </CharacterStats>

            <PlayButton onClick={() => handlePlay(char.id)} disabled={loading}>
              进入游戏
            </PlayButton>
          </CharacterCard>
        ))}

        <CreateCard onClick={() => setShowCreateModal(true)}>
          <CreateIcon>
            <Plus size={32} />
          </CreateIcon>
          <CreateText>创建新角色</CreateText>
        </CreateCard>
      </Content>

      {showCreateModal && (
        <ModalOverlay onClick={() => setShowCreateModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>创建新角色</ModalTitle>
            
            <Form onSubmit={handleCreateCharacter}>
              <Input
                type="text"
                placeholder="角色名称"
                value={newCharacter.name}
                onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                required
              />

              <Select
                value={newCharacter.class}
                onChange={(e) => setNewCharacter({ ...newCharacter, class: e.target.value })}
              >
                {CLASSES.map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </Select>

              <Select
                value={newCharacter.race}
                onChange={(e) => setNewCharacter({ ...newCharacter, race: e.target.value })}
              >
                {RACES.map((race) => (
                  <option key={race} value={race}>{race}</option>
                ))}
              </Select>

              <ButtonGroup>
                <Button
                  type="button"
                  $variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  取消
                </Button>
                <Button type="submit" $variant="primary" disabled={loading}>
                  {loading ? '创建中...' : '创建角色'}
                </Button>
              </ButtonGroup>
            </Form>
          </Modal>
        </ModalOverlay>
      )}
    </CharacterSelectContainer>
  )
}

export default CharacterSelect
