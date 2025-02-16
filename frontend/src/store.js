import { configureStore } from '@reduxjs/toolkit'
import statsReducer from './reducers/statsReducer'
import inhouseReducer from './reducers/inhouseReducer'
import userReducer from './reducers/userReducer'
import pappaReducer from './reducers/pappaReducer'

const store = configureStore({
  reducer: {
    stats: statsReducer,
    inhouse: inhouseReducer,
    user: userReducer,
    pappa: pappaReducer,
  },
})

export default store
