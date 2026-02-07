const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const mongoose = require('mongoose')
const config = require('../utils/config')

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
  const { username, name, password, inviteCode } = request.body

  // Debug logging
  console.log('Registration attempt:');
  console.log('  Received inviteCode:', inviteCode);
  console.log('  Expected INVITE_CODE:', config.INVITE_CODE);
  console.log('  Match:', inviteCode === config.INVITE_CODE);

  // Check for admin secret (header) OR invite code (body)
  const adminSecret = request.get('X-Admin-Secret');
  const isAdminRequest = config.ADMIN_SECRET && adminSecret === config.ADMIN_SECRET;
  const isValidInvite = config.INVITE_CODE && inviteCode === config.INVITE_CODE;

  if (!isAdminRequest && !isValidInvite) {
    return response.status(403).json({
      error: 'Invalid invite code. Contact admin for access.',
    })
  }

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

// ====== /me routes MUST come before /:id to avoid matching "me" as an ID ======

// GET current user's profile (requires auth token)
usersRouter.get('/me/profile', async (request, response) => {
  // Extract user from token (middleware should set request.user)
  if (!request.user) {
    return response.status(401).json({ error: 'Authentication required' });
  }
  
  const user = await User.findById(request.user.id);
  if (!user) {
    return response.status(404).json({ error: 'User not found' });
  }
  
  // Update last login
  user.lastLogin = new Date();
  await user.save();
  
  response.json(user);
});

// PUT update user profile (link Faceit account, update preferences)
usersRouter.put('/me/profile', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'Authentication required' });
  }
  
  const { faceitNickname, faceitPlayerId, teamName, division, preferences } = request.body;
  
  const updateData = {};
  if (faceitNickname !== undefined) updateData.faceitNickname = faceitNickname;
  if (faceitPlayerId !== undefined) updateData.faceitPlayerId = faceitPlayerId;
  if (teamName !== undefined) updateData.teamName = teamName;
  if (division !== undefined) updateData.division = division;
  if (preferences !== undefined) updateData.preferences = preferences;
  
  const user = await User.findByIdAndUpdate(
    request.user.id,
    { $set: updateData },
    { new: true, runValidators: true }
  );
  
  if (!user) {
    return response.status(404).json({ error: 'User not found' });
  }
  
  response.json(user);
});

// POST unlock achievement
usersRouter.post('/me/achievements', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'Authentication required' });
  }
  
  const { achievementId, name, description, icon, tier } = request.body;
  
  if (!achievementId || !name) {
    return response.status(400).json({ error: 'Achievement ID and name required' });
  }
  
  const user = await User.findById(request.user.id);
  if (!user) {
    return response.status(404).json({ error: 'User not found' });
  }
  
  // Check if already unlocked
  const existing = user.achievements.find(a => a.id === achievementId);
  if (existing) {
    return response.status(200).json({ message: 'Achievement already unlocked', achievement: existing });
  }
  
  const newAchievement = {
    id: achievementId,
    name,
    description: description || '',
    icon: icon || 'emoji_events',
    tier: tier || 'bronze',
    unlockedAt: new Date()
  };
  
  user.achievements.push(newAchievement);
  await user.save();
  
  response.status(201).json({ message: 'Achievement unlocked!', achievement: newAchievement });
});

// PUT update personal bests
usersRouter.put('/me/personal-bests', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'Authentication required' });
  }
  
  const { highestKD, highestHSPercent, longestWinStreak, mostKillsMatch, clutchesWon, acesTotal } = request.body;
  
  const user = await User.findById(request.user.id);
  if (!user) {
    return response.status(404).json({ error: 'User not found' });
  }
  
  // Only update if new value is higher
  if (highestKD && highestKD > user.personalBests.highestKD) {
    user.personalBests.highestKD = highestKD;
  }
  if (highestHSPercent && highestHSPercent > user.personalBests.highestHSPercent) {
    user.personalBests.highestHSPercent = highestHSPercent;
  }
  if (longestWinStreak && longestWinStreak > user.personalBests.longestWinStreak) {
    user.personalBests.longestWinStreak = longestWinStreak;
  }
  if (mostKillsMatch && mostKillsMatch > user.personalBests.mostKillsMatch) {
    user.personalBests.mostKillsMatch = mostKillsMatch;
  }
  if (clutchesWon) {
    user.personalBests.clutchesWon = clutchesWon;
  }
  if (acesTotal) {
    user.personalBests.acesTotal = acesTotal;
  }
  
  await user.save();
  response.json(user.personalBests);
});

// ====== /:id routes AFTER /me routes ======

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
