import cards from '../mockData/demos.json'

const getAll = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(cards)
    }, 1000)
  })
}

const create = async (card) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...card, id: Date.now() })
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
