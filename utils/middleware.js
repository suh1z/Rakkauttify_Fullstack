const logger = require("./logger");

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

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");

  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  } else {
    request.token = null;
  }

  next();
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
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
};
