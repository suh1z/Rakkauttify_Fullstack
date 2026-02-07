const logger = require("./logger");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const mongoSanitize = require("mongo-sanitize");

// Sanitize request body to prevent NoSQL injection
const sanitizeBody = (request, response, next) => {
  if (request.body) {
    request.body = mongoSanitize(request.body);
  }
  if (request.query) {
    request.query = mongoSanitize(request.query);
  }
  if (request.params) {
    request.params = mongoSanitize(request.params);
  }
  next();
};

// Extract token from Authorization header
const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  } else {
    request.token = null;
  }
  next();
};

// Verify token and extract user
const userExtractor = async (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({ error: "token missing" });
  }

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: "token invalid" });
    }
    request.user = await User.findById(decodedToken.id);
    if (!request.user) {
      return response.status(401).json({ error: "user not found" });
    }
    next();
  } catch (error) {
    return response.status(401).json({ error: "token invalid or expired" });
  }
};

const requestLogger = (request, response, next) => {
  const sanitizeRequestBody = (body) => {
    const { password, ...sanitizedBody } = body;
    return sanitizedBody;
  };

  const sanitizedBody = sanitizeRequestBody(request.body);

  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", sanitizedBody);
  logger.info("---");
  next();
};

const unknownEndpoint = (request, response) => {
  logger.error(`404 - Not Found: ${request.method} ${request.originalUrl}`);
  response.status(404).send({
    error: "unknown endpoint",
    method: request.method,
    path: request.originalUrl,
  });
};


const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return response
      .status(400)
      .json({ error: "expected `username` to be unique" });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "invalid token" });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({ error: "token expired" });
  }
  next(error);
};

module.exports = {
  sanitizeBody,
  tokenExtractor,
  userExtractor,
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
