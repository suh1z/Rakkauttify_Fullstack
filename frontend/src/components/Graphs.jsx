/* eslint-disable react/prop-types */
import { useEffect } from 'react'
import { playerSetStats } from '../reducers/statsReducer'
import { useDispatch, useSelector } from 'react-redux'
import { Grid, Typography } from '@mui/material'
import Bars from './BarChart'
import Pie from './PieChart'
import Cauge from './CaugeChart'
import Scatter from './ScatterChart'

const Graph = (props) => {
  const dispatch = useDispatch()
  const { playerName } = props

  const playerStats = useSelector((state) => state.stats.playerStats)

  useEffect(() => {
    if (playerName) {
      dispatch(playerSetStats(playerName))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerName])

  if (!playerStats) {
    return <div>Loading...</div>
  }

  try {
    {playerStats[0]['name']}
  } catch (error) {
    return <div>Select a player from matches...</div>
  }
  

  return (
    <><Typography variant="h6">
          Recent 10 Games of {playerStats[0]['name']}
      </Typography><Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                  <Bars data={playerStats} />
              </Grid>
              <Grid item xs={12} sm={6}>
                  <Cauge />
              </Grid>
              <Grid item xs={12} sm={6}>
                  <Scatter data={playerStats} />
              </Grid>
              <Grid item xs={12} sm={6}>
                  <Pie data={playerStats} />
              </Grid>
          </Grid></>
  );
}

export default Graph
