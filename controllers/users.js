const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const mongoose = require('mongoose')

// Validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Password strength validation
const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }
  return { valid: true };
};

// GET all users - protected, only returns limited info
usersRouter.get("/", async (request, response) => {
  // Only return username and name, not full user objects
  const users = await User.find({}).select('username name -_id');
  response.json(users);
});

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  // Validate username
  if (!username || username.length < 3) {
    return response.status(400).json({
      error: 'Username must be at least 3 characters',
    })
  }

  // Validate password strength
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return response.status(400).json({
      error: passwordValidation.error,
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
  const { id } = request.params;
  
  // Validate ObjectId format to prevent injection
  if (!isValidObjectId(id)) {
    return response.status(400).json({ error: 'Invalid user ID format' });
  }
  
  const user = await User.findById(id)
  if (user) {
    response.json(user)
  } else {
    response.status(404).end()
  }
})



module.exports = usersRouter
