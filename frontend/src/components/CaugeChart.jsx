import { Gauge } from '@mui/x-charts/Gauge';
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { playerSetStats } from '../reducers/statsReducer'

const filteredMetrics = [
  'kills',
  'deaths',
  'assists',
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
  const kda = ((values[0]+values[2])/values[1])


  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p>Noob Meter</p>
        <Gauge
          value={values[0]}
          startAngle={0}
          endAngle={360}
          width={200}
          height={200}
          innerRadius="80%"
          outerRadius="100%"
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p>KDA</p>
        <Gauge
          value={kda}
          valueMax={3}
          startAngle={-90}
          endAngle={90}
          width={200}
          height={200}
          innerRadius="80%"
          outerRadius="100%"
        />
      </div>
    </div>
  );
};


export default Cauge

