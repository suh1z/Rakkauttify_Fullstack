import { configureStore } from '@reduxjs/toolkit'
import cardReducer from './reducers/cardReducer'
import statsReducer from './reducers/statsReducer'

const store = configureStore({
  reducer: {
    cards: cardReducer,
    stats: statsReducer,
  },
})

console.log(store.getState())

export default store
