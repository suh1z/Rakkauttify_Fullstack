import axios from 'axios'
const baseUrl = '/api/users'

// Get auth config with token
const getConfig = () => {
  const loggedUser = window.localStorage.getItem('loggedInUser')
  if (loggedUser) {
    const user = JSON.parse(loggedUser)
    return { headers: { Authorization: `Bearer ${user.token}` } }
  }
  return {}
}

const getAllUsers = async () => {
  const response = await axios.get(baseUrl, getConfig())
  return response.data
}

const createUser = async (user) => {
  // Registration doesn't need auth token, just invite code in body
  const response = await axios.post(baseUrl, user)
  return response.data
}

const findUser = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`, getConfig())
  return response.data
}

// Get current user's profile
const getMyProfile = async () => {
  const response = await axios.get(`${baseUrl}/me/profile`, getConfig())
  return response.data
}

// Update current user's profile (link Faceit, preferences)
const updateMyProfile = async (profileData) => {
  const response = await axios.put(`${baseUrl}/me/profile`, profileData, getConfig())
  return response.data
}

// Unlock an achievement
const unlockAchievement = async (achievement) => {
  const response = await axios.post(`${baseUrl}/me/achievements`, achievement, getConfig())
  return response.data
}

// Update personal bests
const updatePersonalBests = async (bests) => {
  const response = await axios.put(`${baseUrl}/me/personal-bests`, bests, getConfig())
  return response.data
}

export default { 
  getAllUsers, 
  createUser, 
  findUser, 
  getMyProfile, 
  updateMyProfile, 
  unlockAchievement, 
  updatePersonalBests 
}
