import { createSlice } from '@reduxjs/toolkit'
import cardService from '../services/cardService'

const cardSlice = createSlice({
  name: 'cards',
  initialState: [],
  reducers: {
    appendCard(state, action) {
      state.push(action.payload)
    },
    setCards(state, action) {
      return action.payload
    },
    deleteCard(state, action) {
      console.log(action.payload)
      return state.filter((blog) => blog.id !== action.payload.id)
    },
  },
})

export const { appendCard, deleteCard, setCards } = cardSlice.actions

export const initializeCards = () => {
  return async (dispatch) => {
    const cards = await cardService.getAll()
    dispatch(setCards(cards))
  }
}

export const createCard = (content) => {
  return async (dispatch) => {
    const newCard = await cardService.create(content)
    dispatch(appendCard(newCard))
  }
}

export const removeCard = (id) => {
  return async (dispatch) => {
    await cardService.remove(id)
    dispatch(deleteCard(id))
  }
}

export default cardSlice.reducer
