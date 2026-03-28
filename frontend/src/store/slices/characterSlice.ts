import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/utils/api'

interface Character {
  id: string
  name: string
  class: string
  spec: string
  faction: 'alliance' | 'horde'
  level: number
  experience: number
  stats: any
  equipment: Record<string, any>
  inventory: any[]
  talents: Record<string, number>
}

interface CharacterState {
  characters: Character[]
  currentCharacter: Character | null
  loading: boolean
  error: string | null
}

const initialState: CharacterState = {
  characters: [],
  currentCharacter: null,
  loading: false,
  error: null,
}

// 获取角色列表
export const fetchCharacters = createAsyncThunk(
  'characters/fetchCharacters',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/characters')
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取角色列表失败')
    }
  }
)

// 创建角色
export const createCharacter = createAsyncThunk(
  'characters/createCharacter',
  async (characterData: {
    name: string
    class: string
    spec: string
    faction: 'alliance' | 'horde'
  }, { rejectWithValue }) => {
    try {
      const response = await api.post('/characters', characterData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '创建角色失败')
    }
  }
)

// 获取单个角色
export const fetchCharacter = createAsyncThunk(
  'characters/fetchCharacter',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/characters/${id}`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取角色信息失败')
    }
  }
)

const characterSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    setCurrentCharacter: (state, action) => {
      state.currentCharacter = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取角色列表
      .addCase(fetchCharacters.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.loading = false
        state.characters = action.payload
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // 创建角色
      .addCase(createCharacter.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createCharacter.fulfilled, (state, action) => {
        state.loading = false
        state.characters.push(action.payload)
      })
      .addCase(createCharacter.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // 获取单个角色
      .addCase(fetchCharacter.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchCharacter.fulfilled, (state, action) => {
        state.loading = false
        state.currentCharacter = action.payload
      })
      .addCase(fetchCharacter.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setCurrentCharacter, clearError } = characterSlice.actions
export default characterSlice.reducer
