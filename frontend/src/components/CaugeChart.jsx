import { Gauge } from '@mui/x-charts/Gauge'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { playerSetStats } from '../reducers/statsReducer'

const filteredMetrics = [
  'kills',
  'deaths',
  'assists',
  'head_shot_kills',
  'entry_count',
  'entry_wins',
  'shots_fired_total',
  'shots_on_target_total',
]

const Cauge = (props) => {
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
  const values = Object.values(sums)
  const hsper = Math.round((values[3] / values[0]) * 100)
  const entryper = Math.round((values[5] / values[4]) * 100)
  const shots = Math.round((values[7] / values[6]) * 100)

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p>HS %</p>
        <Gauge
          value={hsper}
          startAngle={0}
          endAngle={360}
          width={150}
          height={150}
          innerRadius="80%"
          outerRadius="100%"
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p>Accuracy %</p>
        <Gauge
          value={shots}
          startAngle={0}
          endAngle={360}
          width={150}
          height={150}
          innerRadius="80%"
          outerRadius="100%"
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p>Entry Wins %</p>
        <Gauge
          value={entryper}
          startAngle={0}
          endAngle={360}
          width={150}
          height={150}
          innerRadius="80%"
          outerRadius="100%"
        />
      </div>
    </div>
  )
}

export default Cauge
