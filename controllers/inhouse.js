const express = require('express');
const inhouseRouter = express.Router();
const Queue = require('../models/queue');
const User = require('../models/user');

inhouseRouter.get('/', async (req, res) => {
  try {
    const que = await Queue.find({})
      .populate('user', 'user id'); 

      const response = que.map(entry => ({
        username: entry.user.user,
        discordId: entry.user.id
      }));

    res.json(response);

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
})

inhouseRouter.post("/", async (req, res) => {
  const { username, id } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }
  
  try {
    const user = await User.findOne(id);

    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    const que = new Queue({
      user: user._id,
    });

    const savedQue = await que.save();
    res.status(201).json(savedQue);

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

inhouseRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ id: id });
    console.log(`Found user: ${user._id}`);
    const result = await Queue.deleteOne({ user: user._id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Queue entry not found' });
    }

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = inhouseRouter;
