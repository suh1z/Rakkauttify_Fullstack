import { PieChart } from '@mui/x-charts/PieChart'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { playerSetStats } from '../reducers/statsReducer'

const filteredMetrics = ['cash_earned', 'kill_reward', 'equipment_value']

const Pie = (props) => {
  // eslint-disable-next-line react/prop-types
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
    <PieChart
      series={[
        {
          data: [
            { value: values[0], label: keys[0] },
            { value: values[1], label: keys[1] },
            { value: values[2], label: keys[2] },
          ],
        },
      ]}
      width={500}
      height={200}
      paddingAngle={200}
    />
  )
}

export default Pie
