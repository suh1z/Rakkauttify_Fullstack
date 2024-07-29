import { configureStore } from '@reduxjs/toolkit'
import cardReducer from './reducers/cardReducer'
import statsReducer from './reducers/statsReducer'
import inhouseReducer from './reducers/inhouseReducer'
import userReducer from './reducers/userReducer'

const store = configureStore({
  reducer: {
    cards: cardReducer,
    stats: statsReducer,
    inhouse: inhouseReducer,
    user: userReducer,
  },
})

console.log(store.getState())

export default store
