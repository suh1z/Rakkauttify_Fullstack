const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get("/", async (request, response) => {
  const user = await User.find({})
  if (user) {
    response.json(user);
  } else {
    response.status(404).end();
  }
});

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!(username && username.length >= 3 && password && password.length >= 3)) {
    return response.status(400).json({
      error: 'username and password needs to be atleast 3 characters',
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})


usersRouter.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id)
  if (user) {
    response.json(user)
  } else {
    response.status(404).end()
  }
})



module.exports = usersRouter
