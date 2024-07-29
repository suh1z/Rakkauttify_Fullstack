import stats from '../mockData/stats.json'

const statsLookup = stats.reduce((acc, item) => {
  if (!acc[item.matchid]) {
    acc[item.matchid] = []
  }
  acc[item.matchid].push(item)
  return acc
}, {})

const getById = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredStats = statsLookup[id] || []
      resolve(filteredStats)
    }, 100)
  })
}

export default { getById }
