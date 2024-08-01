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

const excludedKeys = ['steamid64', 'name', 'team', 'matchid', 'mapnumber']
const summedKey = ['played']

const getSum = async (recentGamesCount) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const totalGames = stats.length
      const start = Math.max(0, totalGames - recentGamesCount * 10)
      const recentStats = stats.slice(start)
      const result = recentStats.reduce((acc, stat) => {
        const key = stat.steamid64

        if (!acc[key]) {
          acc[key] = {
            name: stat.name,
          }
        }

        Object.entries(stat).forEach(([statKey, value]) => {
          if (!excludedKeys.includes(statKey)) {
            if (!acc[key][statKey]) {
              acc[key][statKey] = 0
            }
            if (summedKey.includes(statKey)) {
              const maxValue = acc[key][statKey]
              if (value > maxValue) {
                acc[key][statKey] = value
              }
            } else {
              acc[key][statKey] += parseInt(value, 10)
            }
          }
        })

        return acc
      }, {})

      console.log(result)
      resolve(result)
    }, 100)
  })
}

const getByPlayerName = async (playerName) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const normalizedPlayerName =
        typeof playerName === 'string' ? playerName.trim().toLowerCase() : ''
      const filteredStats = stats.filter((item) => {
        const nameInItem =
          typeof item.name === 'string' ? item.name.trim().toLowerCase() : ''
        return nameInItem === normalizedPlayerName
      })
      filteredStats.sort((a1, a2) => a1.matchid - a2.matchid)
      const recentTen = filteredStats.slice(-10)
      resolve(recentTen)
    }, 100)
  })
}

export default { getById, getByPlayerName, getSum }
