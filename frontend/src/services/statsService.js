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

const getByPlayerName = async (playerName) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const normalizedPlayerName = typeof playerName === 'string' ? playerName.trim().toLowerCase() : '';
      const filteredStats = stats.filter(item => {
        const nameInItem = typeof item.name === 'string' ? item.name.trim().toLowerCase() : '';
        return nameInItem === normalizedPlayerName;
      })
      filteredStats.sort((a1,a2) => a1.matchid - a2.matchid)
      const recentTen = filteredStats.slice(-10);
      resolve(recentTen);
    }, 100)
  })
}

export default { getById, getByPlayerName }
