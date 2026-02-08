const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  icon: { type: String },
  unlockedAt: { type: Date, default: Date.now },
  tier: { type: String, enum: ['bronze', 'silver', 'gold', 'diamond'], default: 'bronze' }
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  name: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  // Faceit/Pappaliiga linking
  faceitNickname: {
    type: String,
    default: null,
  },
  faceitPlayerId: {
    type: String,
    default: null,
  },
  // Steam ID for matching with game stats
  steamId: {
    type: String,
    default: null,
  },
  teamName: {
    type: String,
    default: null,
  },
  division: {
    type: Number,
    default: null,
  },
  // Achievements & Stats
  achievements: [achievementSchema],
  // Personal bests (tracked over time)
  personalBests: {
    highestKD: { type: Number, default: 0 },
    highestHSPercent: { type: Number, default: 0 },
    longestWinStreak: { type: Number, default: 0 },
    mostKillsMatch: { type: Number, default: 0 },
    clutchesWon: { type: Number, default: 0 },
    acesTotal: { type: Number, default: 0 },
  },
  // Preferences
  preferences: {
    theme: { type: String, default: 'dark' },
    favoriteMap: { type: String, default: null },
  },
  // Liked/favorited matches (stored as match IDs)
  likedMatches: [{
    type: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  }
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash; // Remove the password hash
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
