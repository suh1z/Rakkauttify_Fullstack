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
  const response = await axios.post(baseUrl, user, getConfig())
  return response.data
}

const findUser = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`, getConfig())
  return response.data
}

export default { getAllUsers, createUser, findUser }
