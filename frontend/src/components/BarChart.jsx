/* eslint-disable react/prop-types */
import { BarChart } from '@mui/x-charts/BarChart'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { playerSetStats } from '../reducers/statsReducer'

const filteredMetrics = [
  'kills',
  'deaths',
  'assists',
  'enemy2ks',
  'enemy3ks',
  'enemy4ks',
  'enemy5ks',
  'enemies_flashed',
  'utility_count',
  'utility_damage',
  'utility_successes',
  'utility_enemies',
  'flash_count',
  'flash_successes',
]

const Bars = (props) => {
  const { playerName } = props

  const dispatch = useDispatch()

  const playerStats = useSelector((state) => state.stats.playerStats)

  useEffect(() => {
    if (playerName) {
      dispatch(playerSetStats(playerName))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerName])

  const sumObj = (stats, properties) => {
    return properties.reduce((sums, property) => {
      sums[property] = stats.reduce(
        (acc, item) => acc + (parseInt(item[property]) || 0),
        0
      )
      return sums
    }, {})
  }

  const sums = sumObj(playerStats, filteredMetrics)

  const keys = Object.keys(sums)
  const values = Object.values(sums)

  return (
    <>
      <BarChart
        xAxis={[{ scaleType: 'band', data: keys.slice(0, 7) }]}
        series={[{ data: values.slice(0, 7), color: '#fdb462' }]}
        width={500}
        height={300}
      />
      <BarChart
        xAxis={[{ scaleType: 'band', data: keys.slice(7, 16) }]}
        series={[{ data: values.slice(0, 7), color: '#fdb462' }]}
        width={500}
        height={300}
      />
    </>
  )
}

export default Bars
