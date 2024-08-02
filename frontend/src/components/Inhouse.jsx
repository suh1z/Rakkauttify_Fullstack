/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from 'react-redux'
import {
  createInhouse,
  initializeInhouse,
  removeInhouse,
} from '../reducers/inhouseReducer'
import { useEffect } from 'react'
import { Button, List, ListItem, Container, Typography } from '@mui/material'

const serverIp = 'https://tinyurl.com/264bus8k'

const Inhouse = ({ user }) => {
  const users = useSelector((state) => state.inhouse)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeInhouse())
    const intervalId = setInterval(() => {
      dispatch(initializeInhouse())
    }, 3000)

    return () => clearInterval(intervalId)
  }, [dispatch])

  const isQueueFull = users.length >= 10

  const currentUser = user.user.username
  const index = users.findIndex((user) => user.username === currentUser)

  const joinMatch = () => {
    if (isQueueFull) {
      alert('Queue is already full. you are in reserve')
      dispatch(createInhouse(user.user.username))
    }

    dispatch(createInhouse(user.user.username))
    alert('Joined queue!')
  }

  const handleStartMatch = () => {
    window.open(serverIp, '_blank')
  }

  const handleDeleteQue = (username) => () => {
    dispatch(removeInhouse(username))
  }

  const plusyks = 10 - users.length

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        In-House Game Queue {plusyks < 10 ? `+${plusyks}` : ''}
      </Typography>
      <Button variant="contained" color="primary" onClick={joinMatch}>
        Join Queue
      </Button>

      <List>
        {users.map((user, index) => (
          <ListItem key={index}>
            {user.username} {index >= 10 && <strong>** ON RESERVE **</strong>}
            <Button onClick={handleDeleteQue(user.username)}>Delete</Button>
          </ListItem>
        ))}
      </List>

      {isQueueFull && index < 10 && (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleStartMatch}
          fullWidth
        >
          Start Match
        </Button>
      )}
    </Container>
  )
}

export default Inhouse
