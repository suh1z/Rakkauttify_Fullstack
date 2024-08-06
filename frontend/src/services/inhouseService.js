import axios from 'axios'

const baseURL = '/api/inhouse'

const getAll = async () => {
  try {
    const response = await axios.get(baseURL)
    return response.data
  } catch (error) {
    console.error('Error fetching the queue:', error)
    throw error
  }
}

const create = async (username) => {
  try {
    const response = await axios.post(baseURL, username)
    return response.data
  } catch (error) {
    console.error('Error adding to the queue:', error)
    throw error
  }
}

const remove = async (username) => {
  try {
    await axios.delete(`${baseURL}/${username.discordId}`)
  } catch (error) {
    console.error('Error removing from the queue:', error)
    throw error
  }
}

export default { getAll, create, remove }
