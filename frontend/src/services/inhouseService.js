import players from '../mockData/players.json'

const getAll = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(players)
    }, 1000)
  })
}

const create = async (players) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...players, id: Date.now() })
    }, 1000)
  })
}

const remove = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(id)
    }, 1000)
  })
}

export default { getAll, create, remove }
