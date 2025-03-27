const config = require("./utils/config");
const express = require("express");
const app = express();
const path = require('path');
require("express-async-errors");
const cors = require("cors");
const usersRouter = require("./controllers/users");
const inhouseRouter = require("./controllers/inhouse");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const loginRouter = require("./controllers/login");
const testingRouter = require("./controllers/testing");
const leagueRouter = require("./controllers/leagueStats");
const azureRouter = require("./controllers/testing");

mongoose.set("strictQuery", false);

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connection to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/login", loginRouter);
app.use("/api/users", usersRouter );
app.use("/api/inhouse", inhouseRouter);
app.use("/api/months", leagueRouter);
app.use("/api/fetch-match-data", leagueRouter);
app.use("/api/players", leagueRouter);
app.use("/api/faceit-profile", leagueRouter);
app.use('/api/data', azureRouter);
app.use("/api/player", azureRouter); 
app.use("/api/matches", azureRouter);
app.use("/api/allmatches", azureRouter);
app.use("/api/pickbans", azureRouter);


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

if (process.env.NODE_ENV === "test") {
  app.use("/api/testing", testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
