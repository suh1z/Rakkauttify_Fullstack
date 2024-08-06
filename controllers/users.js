const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
  const { user, id, token } = request.body;

  try {
  if (!token) {
    response.status(400).end();

  }
  const discordUser = new User({
    user,
    id,
  });

  const savedUser = await discordUser.save();
  response.status(201).json(savedUser);
} catch {
  response.status(404).end();
}
});

usersRouter.get("/", async (request, response) => {
  const user = await User.find({})
  if (user) {
    response.json(user);
  } else {
    response.status(404).end();
  }
});

usersRouter.get("/:id", async (request, response) => {
  const user = await User.findById({})
  if (user) {
    response.json(user);
  } else {
    response.status(404).end();
  }
});

module.exports = usersRouter;
