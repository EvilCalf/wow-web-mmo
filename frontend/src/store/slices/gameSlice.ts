import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { GameState, Character } from '@/types'
import api from '@/utils/api'

const initialState: GameState = {
  currentUser: null,
  currentCharacter: null,
  isLoggedIn: false,
  isInGame: false,
  loading: false,
  error: null,
}

export const getCharacters = createAsyncThunk(
  'game/getCharacters',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/characters')
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get characters')
    }
  }
)

export const createCharacter = createAsyncThunk(
  'game/createCharacter',
  async (characterData: Omit<Character, 'id' | 'level' | 'health' | 'maxHealth' | 'mana' | 'maxMana' | 'position' | 'equipment' | 'inventory' | 'spells'>, { rejectWithValue }) => {
    try {
      const response = await api.post('/characters', characterData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create character')
    }
  }
)

export const selectCharacter = createAsyncThunk(
  'game/selectCharacter',
  async (characterId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/characters/${characterId}`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to select character')
    }
  }
)

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    enterGame: (state) => {
      state.isInGame = true
    },
    leaveGame: (state) => {
      state.isInGame = false
      state.currentCharacter = null
    },
    updateCharacterPosition: (state, action: PayloadAction<{ x: number; y: number }>) => {
      if (state.currentCharacter) {
        state.currentCharacter.position.x = action.payload.x
        state.currentCharacter.position.y = action.payload.y
      }
    },
    updateCharacterStats: (state, action: PayloadAction<Partial<Character>>) => {
      if (state.currentCharacter) {
        state.currentCharacter = { ...state.currentCharacter, ...action.payload }
      }
    },
    clearGameError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCharacters.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCharacters.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(getCharacters.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(createCharacter.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createCharacter.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(createCharacter.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(selectCharacter.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(selectCharacter.fulfilled, (state, action: PayloadAction<Character>) => {
        state.loading = false
        state.currentCharacter = action.payload
      })
      .addCase(selectCharacter.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { enterGame, leaveGame, updateCharacterPosition, updateCharacterStats, clearGameError } = gameSlice.actions
export default gameSlice.reducer
