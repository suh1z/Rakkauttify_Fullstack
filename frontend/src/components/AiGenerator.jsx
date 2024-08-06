/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { initializeStatistics } from '../reducers/statsReducer'
import { useDispatch, useSelector } from 'react-redux'

const Ai = () => {
  const dispatch = useDispatch()
  const data = useSelector((state) => state.stats.statistics)

  useEffect(() => {
    dispatch(initializeStatistics())
  }, [])

  if (!data) {
    return <div>Loading...</div>
  }

  return <div>WORK IN PROGRESS</div>
}

export default Ai
