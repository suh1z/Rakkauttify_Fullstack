/* eslint-disable react/prop-types */
import { useEffect } from 'react'
import InfoChart from './InfoChart'
import { initializeMatch } from '../reducers/statsReducer'
import { useDispatch, useSelector } from 'react-redux'

const Stats = (props) => {
  const dispatch = useDispatch()
  const matchData = useSelector((state) => state.stats.match)

  useEffect(() => {
    if (props.id) {
      dispatch(initializeMatch(props.id))
    }
  }, [props.id])

  if (!matchData) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <InfoChart data={matchData} />
    </div>
  )
}

export default Stats
