/* eslint-disable react/prop-types */
import { useEffect } from 'react'
import InfoChart from './InfoChart'
import { initializeStats } from '../reducers/statsReducer'
import { useDispatch, useSelector } from 'react-redux'

const Stats = (props) => {
  const dispatch = useDispatch()
  const statsData = useSelector((state) => state.stats)
  console.log(statsData)

  useEffect(() => {
    dispatch(initializeStats(props.id))
  }, [dispatch, props.id])

  if (!statsData) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <InfoChart data={statsData} />
    </div>
  )
}

export default Stats
