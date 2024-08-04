import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/loginService'
import userService from '../services/userService'

const initialState = {
  users: [],
  user: null,
  token: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload.user
      state.token = action.payload.token
    },
    setUsers(state, action) {
      state.users = action.payload
    },
    clearUser(state) {
      state.user = null
      state.token = null
    },
  },
})

export const { setUser, clearUser, setUsers, setDiscord } = userSlice.actions

export const allUsers = () => {
  return async (dispatch) => {
    const users = await userService.getAllUsers()
    dispatch(setUsers(users))
  }
}

export const getDiscord = (code) => {
  return async (dispatch) => {
    const users = await userService.createUser(code)
    dispatch(setDiscord(users))
  }
}

export const loginUser = (credentials) => {
  return async (dispatch) => {
    const user = await loginService.login(credentials)
    dispatch(setUser({ user: user, token: user.token }))
  }
}

export const initializeUser = () => {
  return (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('loggedDiscordUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
    }
  }
}

export const logoutUser = () => {
  return async (dispatch) => {
    await loginService.removeToken()
    dispatch(clearUser())
  }
}

export default userSlice.reducer
