const config = require("./utils/config");
const express = require("express");
const app = express();
const path = require('path');
require("express-async-errors");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const usersRouter = require("./controllers/users");
const inhouseRouter = require("./controllers/inhouse");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const loginRouter = require("./controllers/login");
const testingRouter = require("./controllers/testing");
const leagueRouter = require("./controllers/leagueStats");
const azureRouter = require("./controllers/testing");

// Validate critical environment variables at startup
if (!process.env.SECRET) {
  logger.error("CRITICAL: JWT SECRET is not defined. Exiting...");
  process.exit(1);
}

mongoose.set("strictQuery", false);

logger.info("Attempting to connect to MongoDB...");

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connection to MongoDB:", error.message);
  });

mongoose.connection.on('disconnected', () => {
    logger.info('MongoDB disconnected!');
});

mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error:', err);
});

// Security: Helmet for HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.faceit.com", "https://open.faceit.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Security: CORS - restrict to allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3003',
  'https://lovecanal.onrender.com',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Security: Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // 1000 requests per window
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 login attempts per window
  message: { error: 'Too many login attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(generalLimiter);

app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.sanitizeBody);
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

// Public routes (no auth required)
app.use("/api/login", loginLimiter, loginRouter);

// User routes with conditional auth
// POST /api/users (registration) - public, protected by admin secret in controller
// POST /api/users/likes/counts - public (get like counts)
// Other /api/users routes - require auth token
app.use("/api/users", (req, res, next) => {
  // Allow registration (POST to root)
  if (req.method === 'POST' && req.path === '/') {
    return next();
  }
  // Allow public like counts endpoint
  if (req.method === 'POST' && req.path === '/likes/counts') {
    return next();
  }
  // All other routes require authentication
  middleware.userExtractor(req, res, next);
}, usersRouter);

// Protected routes (auth required)
app.use("/api/inhouse", middleware.userExtractor, inhouseRouter);

// Public data routes (read-only, no sensitive data)
app.use("/api/matches", leagueRouter);
app.use("/api/months", leagueRouter);
app.use("/api/fetch-match-data", leagueRouter);
app.use("/api/players", leagueRouter);
app.use("/api/faceit-profile", leagueRouter);
app.use('/api/data', azureRouter);
app.use("/api/player", azureRouter); 
app.use("/api/allmatches", azureRouter);
app.use("/api/pickbans", azureRouter);

// Health check endpoint for Render
app.get('/health', (req, res) => {
  const healthcheck = {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  };
  res.status(200).json(healthcheck);
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

if (process.env.NODE_ENV === "test") {
  app.use("/api/testing", testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
