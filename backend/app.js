const config = require("./utils/config");
const express = require("express");
const app = express();
require("express-async-errors");
const cors = require("cors");
const usersRouter = require("./controllers/users");
const inhouseRouter = require("./controllers/inhouse");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const loginRouter = require("./controllers/login");
const testingRouter = require("./controllers/testing");

mongoose.set("strictQuery", false);

logger.info("connecting to", config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connection to MongoDB:", error.message);
  });

app.use(middleware.requestLogger);
app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

app.use("/api/login", loginRouter);
app.use("/api/users", usersRouter);
app.use("/api/inhouse", inhouseRouter);

if (process.env.NODE_ENV === "test") {
  app.use("/api/testing", testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
