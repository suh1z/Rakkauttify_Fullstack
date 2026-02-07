import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/loginService'
import userService from '../services/userService'

const initialState = {
  user: null,
  profile: null,
  profileLoading: false,
  profileError: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload
    },
    clearUser(state) {
      state.user = null
      state.profile = null
    },
    setProfile(state, action) {
      state.profile = action.payload
      state.profileLoading = false
      state.profileError = null
    },
    setProfileLoading(state) {
      state.profileLoading = true
      state.profileError = null
    },
    setProfileError(state, action) {
      state.profileError = action.payload
      state.profileLoading = false
    },
    updateProfileAchievements(state, action) {
      if (state.profile) {
        state.profile.achievements = action.payload
      }
    },
    updateProfilePersonalBests(state, action) {
      if (state.profile) {
        state.profile.personalBests = action.payload
      }
    },
  },
})

export const { 
  setUser, 
  clearUser, 
  setProfile, 
  setProfileLoading, 
  setProfileError,
  updateProfileAchievements,
  updateProfilePersonalBests,
} = userSlice.actions

export const loginUser = (credentials) => {
  return async (dispatch) => {
    const user = await loginService.login(credentials)
    window.localStorage.setItem('loggedInUser', JSON.stringify(user))
    dispatch(setUser(user))
  }
}

export const initializeUser = () => {
  return async (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
    }
  }
}

export const logoutUser = () => {
  return async (dispatch) => {
    window.localStorage.removeItem('loggedInUser')
    dispatch(clearUser())
  }
}

// Fetch user's full profile from database
export const fetchMyProfile = () => {
  return async (dispatch) => {
    dispatch(setProfileLoading())
    try {
      const profile = await userService.getMyProfile()
      dispatch(setProfile(profile))
    } catch (error) {
      dispatch(setProfileError(error.response?.data?.error || 'Failed to fetch profile'))
    }
  }
}

// Update user profile (link Faceit account, etc.)
export const updateMyProfile = (profileData) => {
  return async (dispatch) => {
    try {
      const updatedProfile = await userService.updateMyProfile(profileData)
      dispatch(setProfile(updatedProfile))
      return updatedProfile
    } catch (error) {
      dispatch(setProfileError(error.response?.data?.error || 'Failed to update profile'))
      throw error
    }
  }
}

// Unlock an achievement
export const unlockAchievement = (achievement) => {
  return async (dispatch, getState) => {
    try {
      await userService.unlockAchievement(achievement)
      // Refresh profile to get updated achievements
      const profile = await userService.getMyProfile()
      dispatch(updateProfileAchievements(profile.achievements))
    } catch (error) {
      console.error('Failed to unlock achievement:', error)
    }
  }
}

// Update personal bests
export const updatePersonalBests = (bests) => {
  return async (dispatch) => {
    try {
      const updatedBests = await userService.updatePersonalBests(bests)
      dispatch(updateProfilePersonalBests(updatedBests))
    } catch (error) {
      console.error('Failed to update personal bests:', error)
    }
  }
}

export default userSlice.reducer
