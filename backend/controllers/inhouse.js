const express = require("express");
const inhouseRouter = express.Router();

let queue = [];

inhouseRouter.get("/", (req, res) => {
  res.json(queue);
});

inhouseRouter.post("/", (req, res) => {
  const { username } = req.body;

  if (!username || username.length < 1) {
    return res.status(400).json({
      error: "Username needs to be at least 1 character long",
    });
  }

  if (queue.find((user) => user.username === username)) {
    return res.status(400).json({
      error: "User is already in the queue",
    });
  }

  queue.push({ username });
  res.status(201).json({ username });
});

inhouseRouter.delete("/:username", (req, res) => {
  const { username } = req.params;
  queue = queue.filter((user) => user.username !== username);
  res.status(204).end();
});

module.exports = inhouseRouter;
