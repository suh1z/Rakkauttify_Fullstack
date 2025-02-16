import axios from 'axios'

const baseUrl = '/api/login'

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

const removeToken = () => {
  localStorage.removeItem('loggedUser')
  localStorage.removeItem('loggedDiscordUser')
}
export default { login, removeToken }
