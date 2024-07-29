import axios from 'axios'

const baseUrl = '/api/login'
let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
  localStorage.setItem('token', token)
}

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  const newToken = response.data.token
  setToken(newToken)
  return response.data
}

const getToken = () => {
  return localStorage.getItem('token')
}

const getConfig = () => {
  return {
    headers: { Authorization: getToken() },
  }
}

export default { login, setToken, getConfig }
