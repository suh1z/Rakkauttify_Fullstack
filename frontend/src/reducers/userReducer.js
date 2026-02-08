import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/loginService'
import userService from '../services/userService'

const initialState = {
  user: null,
  profile: null,
  profileLoading: false,
  profileError: null,
  likedMatches: [], // Store liked match IDs for quick access
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload
      // Initialize likedMatches from user data if available
      if (action.payload?.likedMatches) {
        state.likedMatches = action.payload.likedMatches
      }
    },
    clearUser(state) {
      state.user = null
      state.profile = null
      state.likedMatches = []
    },
    setProfile(state, action) {
      state.profile = action.payload
      state.profileLoading = false
      state.profileError = null
      // Also update likedMatches from profile
      if (action.payload?.likedMatches) {
        state.likedMatches = action.payload.likedMatches
      }
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
    // Like actions for instant UI update
    addLikedMatch(state, action) {
      const matchId = String(action.payload)
      if (!state.likedMatches.includes(matchId)) {
        state.likedMatches.push(matchId)
      }
    },
    removeLikedMatch(state, action) {
      const matchId = String(action.payload)
      state.likedMatches = state.likedMatches.filter(id => id !== matchId)
    },
    setLikedMatches(state, action) {
      state.likedMatches = action.payload || []
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
  addLikedMatch,
  removeLikedMatch,
  setLikedMatches,
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

// Like a match - optimistic update for instant UI feedback
export const likeMatch = (matchId) => {
  return async (dispatch) => {
    const id = String(matchId)
    // Optimistic update - add immediately
    dispatch(addLikedMatch(id))
    try {
      await userService.likeMatch(id)
    } catch (error) {
      // Rollback on error
      console.error('Failed to like match:', error)
      dispatch(removeLikedMatch(id))
    }
  }
}

// Unlike a match - optimistic update for instant UI feedback
export const unlikeMatch = (matchId) => {
  return async (dispatch) => {
    const id = String(matchId)
    // Optimistic update - remove immediately
    dispatch(removeLikedMatch(id))
    try {
      await userService.unlikeMatch(id)
    } catch (error) {
      // Rollback on error
      console.error('Failed to unlike match:', error)
      dispatch(addLikedMatch(id))
    }
  }
}

// Fetch user's liked matches
export const fetchLikedMatches = () => {
  return async (dispatch) => {
    try {
      const data = await userService.getLikedMatches()
      dispatch(setLikedMatches(data.likedMatches))
    } catch (error) {
      console.error('Failed to fetch liked matches:', error)
    }
  }
}

export default userSlice.reducer
