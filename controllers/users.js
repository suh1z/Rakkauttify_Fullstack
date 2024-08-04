const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
  const { user, id } = request.body;

  const discordUser = new User({
    user,
    id,
  });

  const savedUser = await discordUser.save();
  response.status(201).json(savedUser);
});

usersRouter.get("/:id", async (request, response) => {
  const user = await User.findById(request.params.id);
  if (user) {
    response.json(user);
  } else {
    response.status(404).end();
  }
});

module.exports = usersRouter;
