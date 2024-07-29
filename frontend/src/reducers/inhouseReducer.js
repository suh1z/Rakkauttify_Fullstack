import { createSlice } from '@reduxjs/toolkit'
import inhouseService from '../services/inhouseService'

const inhouseSlice = createSlice({
  name: 'inhouse',
  initialState: [],
  reducers: {
    appendPlayer(state, action) {
      state.push(action.payload)
    },
    setPlayers(state, action) {
      return action.payload
    },
    deletePlayer(state, action) {
      console.log(action.payload)
      return state.filter((players) => players.username !== action.payload)
    },
  },
})

export const { appendPlayer, deletePlayer, setPlayers } = inhouseSlice.actions

export const initializeInhouse = () => {
  return async (dispatch) => {
    const cards = await inhouseService.getAll()
    dispatch(setPlayers(cards))
  }
}

export const createInhouse = (content) => {
  return async (dispatch) => {
    const newCard = await inhouseService.create(content)
    dispatch(appendPlayer(newCard))
  }
}

export const removeInhouse = (name) => {
  return async (dispatch) => {
    await inhouseService.remove(name)
    dispatch(deletePlayer(name))
  }
}

export default inhouseSlice.reducer
