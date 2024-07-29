import { useDispatch, useSelector } from 'react-redux'
import { createInhouse, initializeInhouse, removeInhouse } from '../reducers/inhouseReducer'
import { useEffect, useState } from 'react'
import {
  Button,
  List,
  ListItem,
  Container,
  Typography,
} from '@mui/material'

const serverIp = 'https://tinyurl.com/264bus8k'

const Inhouse = () => {
  const users = useSelector((state) => state.inhouse)
  const [newUser, setNewUser] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeInhouse())
  }, [dispatch])

  const isQueueFull = users.length >= 10

  const joinMatch = () => {
    if (newUser.trim() === '') {
      alert('Please enter a user name.')
      return
    }
    if (isQueueFull) {
      alert('Queue is already full.')
      return
    }
    dispatch(createInhouse({ name: newUser }))
    setNewUser('')
    alert('Joined queue!')
  }

  const handleStartMatch = () => {
    window.open(serverIp, '_blank')
  }

  const handleDeleteQue = (name) => {
    return () => dispatch(removeInhouse(name))
  }


  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        In-House Game Queue
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={joinMatch}
        disabled={isQueueFull}
        fullWidth
      >
        Join Queue
      </Button>

      <List>
        {users.map((user, index) => (
          <ListItem key={index}>{user.name}
          <Button onClick={handleDeleteQue(user.name)}> Delete</Button>
          </ListItem>
        ))}
      </List>

      {isQueueFull && (
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
