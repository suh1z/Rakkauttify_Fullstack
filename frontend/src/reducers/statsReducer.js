import { createSlice } from '@reduxjs/toolkit'
import statsService from '../services/statsService'

const cardSlice = createSlice({
  name: 'stats',
  initialState: [],
  reducers: {
    setStats(state, action) {
      return action.payload
    },
  },
})

export const { setStats } = cardSlice.actions

export const initializeStats = (id) => async (dispatch) => {
  try {
    const data = await statsService.getById(id)
    dispatch(setStats(data))
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

export default cardSlice.reducer
