import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/utils/api'

interface BattleActor {
  id: string
  type: 'player' | 'enemy'
  name: string
  class?: string
  level: number
  health: number
  maxHealth: number
  resource: number
  maxResource: number
  resourceType: string
  stats: any
  isPlayer?: boolean
  buffs?: any[]
  debuffs?: any[]
}

interface BattleLog {
  type: string
  actorId: string
  targetId?: string
  skillId?: string
  value?: number
  message: string
  timestamp: number
}

interface BattleState {
  id: string
  actors: BattleActor[]
  turn: number
  currentActorId: string
  logs: BattleLog[]
  isOver: boolean
  winner?: 'player' | 'enemy'
  rewards?: any
}

interface GameState {
  battle: BattleState | null
  classes: any[]
  dungeons: any[]
  items: any[]
  skills: any[]
  loading: boolean
  error: string | null
}

const initialState: GameState = {
  battle: null,
  classes: [],
  dungeons: [],
  items: [],
  skills: [],
  loading: false,
  error: null,
}

// 获取职业列表
export const fetchClasses = createAsyncThunk(
  'game/fetchClasses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/game-data/classes')
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取职业列表失败')
    }
  }
)

// 获取副本列表
export const fetchDungeons = createAsyncThunk(
  'game/fetchDungeons',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/dungeons')
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取副本列表失败')
    }
  }
)

// 开始 PVE 战斗
export const startPVEBattle = createAsyncThunk(
  'game/startPVEBattle',
  async (data: { characterId: string; dungeonId: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/battle/start-pve', data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '开始战斗失败')
    }
  }
)

// 执行技能
export const executeSkill = createAsyncThunk(
  'game/executeSkill',
  async (data: { battleId: string; actorId: string; skillId: string; targetId: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/battle/${data.battleId}/execute`, {
        actorId: data.actorId,
        skillId: data.skillId,
        targetId: data.targetId,
      })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '执行技能失败')
    }
  }
)

// 领取奖励
export const claimRewards = createAsyncThunk(
  'game/claimRewards',
  async (data: { battleId: string; characterId: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/battle/${data.battleId}/claim-rewards`, {
        characterId: data.characterId,
      })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '领取奖励失败')
    }
  }
)

// 获取战斗状态
export const fetchBattle = createAsyncThunk(
  'game/fetchBattle',
  async (battleId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/battle/${battleId}`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取战斗状态失败')
    }
  }
)

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setBattle: (state, action) => {
      state.battle = action.payload
    },
    clearBattle: (state) => {
      state.battle = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取职业列表
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false
        state.classes = action.payload
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // 获取副本列表
      .addCase(fetchDungeons.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchDungeons.fulfilled, (state, action) => {
        state.loading = false
        state.dungeons = action.payload
      })
      .addCase(fetchDungeons.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // 开始战斗
      .addCase(startPVEBattle.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(startPVEBattle.fulfilled, (state, action) => {
        state.loading = false
        state.battle = action.payload
      })
      .addCase(startPVEBattle.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // 执行技能
      .addCase(executeSkill.pending, (state) => {
        state.loading = true
      })
      .addCase(executeSkill.fulfilled, (state, action) => {
        state.loading = false
        state.battle = action.payload
      })
      .addCase(executeSkill.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // 获取战斗状态
      .addCase(fetchBattle.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchBattle.fulfilled, (state, action) => {
        state.loading = false
        state.battle = action.payload
      })
      .addCase(fetchBattle.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setBattle, clearBattle, clearError } = gameSlice.actions
export default gameSlice.reducer
