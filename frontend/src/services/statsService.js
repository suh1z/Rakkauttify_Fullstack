import stats from '../mockData/stats.json'
import matches from '../mockData/demos.json'

const getStats = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(stats)
    }, 100)
  })
}

const getMatches = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(matches)
    }, 100)
  })
}

export default { getStats, getMatches }
