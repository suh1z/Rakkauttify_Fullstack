const express = require("express");
const inhouseRouter = express.Router();

let queue = [];

inhouseRouter.get("/", (req, res) => {
  res.json(queue);
  console.log(queue);
});

inhouseRouter.post("/", (req, res) => {
  const { username } = req.body;
  console.log(req.body);
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  if (queue.find((user) => user.username === username)) {
    return res.status(400).json({ error: "User is already in the queue" });
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
