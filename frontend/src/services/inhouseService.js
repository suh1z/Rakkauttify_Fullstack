import axios from 'axios'

const baseURL = '/api/inhouse'

// Get auth config with token
const getConfig = () => {
  const loggedUser = window.localStorage.getItem('loggedInUser')
  if (loggedUser) {
    const user = JSON.parse(loggedUser)
    return { headers: { Authorization: `Bearer ${user.token}` } }
  }
  return {}
}

const getAll = async () => {
  try {
    const response = await axios.get(baseURL, getConfig())
    return response.data
  } catch (error) {
    console.error('Error fetching the queue:', error)
    throw error
  }
}

const create = async (username) => {
  try {
    const response = await axios.post(baseURL, username, getConfig())
    return response.data
  } catch (error) {
    console.error('Error adding to the queue:', error)
    throw error
  }
}

const remove = async (username) => {
  try {
    await axios.delete(`${baseURL}/${username.discordId}`, getConfig())
  } catch (error) {
    console.error('Error removing from the queue:', error)
    throw error
  }
}

export default { getAll, create, remove }
