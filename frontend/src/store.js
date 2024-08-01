import { configureStore } from '@reduxjs/toolkit'
import statsReducer from './reducers/statsReducer'
import inhouseReducer from './reducers/inhouseReducer'
import userReducer from './reducers/userReducer'

const store = configureStore({
  reducer: {
    stats: statsReducer,
    inhouse: inhouseReducer,
    user: userReducer,
  },
})

console.log(store.getState())

export default store
