import axios from 'axios'
const baseUrl = '/api/users'

const getAllUsers = async () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const createUser = async (user) => {
  const request = axios.post(baseUrl, user)
  return request.then((response) => response.data)
}

export default { getAllUsers, createUser }
