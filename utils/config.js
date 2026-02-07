require("dotenv").config();

const PORT = process.env.PORT || 3003;

const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.NODE_ENV === "development"
      ? process.env.DEV_MONGODB_URI
      : process.env.MONGODB_URI;

// Admin secret for protected operations
const ADMIN_SECRET = process.env.ADMIN_SECRET;
// Invite code for user registration (separate from admin)
const INVITE_CODE = process.env.INVITE_CODE;

if (!MONGODB_URI) {
  console.error("ERROR: MONGODB_URI is undefined. Check your .env file.");
}

if (!ADMIN_SECRET) {
  console.warn("WARNING: ADMIN_SECRET is not set. Admin operations will be disabled.");
}

if (!INVITE_CODE) {
  console.warn("WARNING: INVITE_CODE is not set. User registration will be disabled.");
}

module.exports = {
  MONGODB_URI,
  PORT,
  ADMIN_SECRET,
  INVITE_CODE,
};
