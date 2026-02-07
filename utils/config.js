require("dotenv").config();

const PORT = process.env.PORT || 3003;

const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.NODE_ENV === "development"
      ? process.env.DEV_MONGODB_URI
      : process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("ERROR: MONGODB_URI is undefined. Check your .env file.");
}

module.exports = {
  MONGODB_URI,
  PORT,
};
