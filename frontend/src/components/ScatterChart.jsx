import { ScatterChart } from '@mui/x-charts'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { playerSetStats } from '../reducers/statsReducer'

const filteredMetrics = ['kills', 'deaths', 'assists']

const Scatter = (props) => {
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

  const renamedStats = playerStats.map((stat) => {
    const filteredStat = {}
    filteredMetrics.forEach((metric) => {
      if (stat[metric] !== undefined) {
        filteredStat[metric] = stat[metric]
      }
    })

    return {
      x: filteredStat.kills,
      y: filteredStat.deaths,
      z: filteredStat.assists,
    }
  })

  console.log(renamedStats)

  return (
    <ScatterChart
      width={400}
      height={400}
      series={[
        {
          data: renamedStats.map((point) => ({
            ...point,
            z: point.x + point.y,
          })),
        },
      ]}
      xAxis={[
        {
          colorMap: {
            type: 'piecewise',
            thresholds: [-1.5, 0, 1.5],
            colors: ['#d01c8b', '#f1b6da', '#b8e186', '#4dac26'],
          },
        },
      ]}
      yAxis={[{}]}
      zAxis={[{}]}
    />
  )
}

export default Scatter
