import { createSlice } from '@reduxjs/toolkit'
import statsService from '../services/statsService'

const cardSlice = createSlice({
  name: 'stats',
  initialState: {
    stats: [],
    playerStats: []
  },
  reducers: {
    setStats(state, action) {
      state.stats = action.payload
    },
    setPlayerStats(state, action) {
      state.playerStats = action.payload
    },
  },
})

export const { setStats, setPlayerStats } = cardSlice.actions

export const initializeStats = (id) => async (dispatch) => {
  try {
    const data = await statsService.getById(id)
    dispatch(setStats(data))
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

export const playerSetStats = (player) => async (dispatch) => {
  try {
    const data = await statsService.getByPlayerName(player)
    dispatch(setPlayerStats(data))
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

export default cardSlice.reducer
