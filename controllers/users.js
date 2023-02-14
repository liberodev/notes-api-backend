const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')

usersRouter.get('/', async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  try {
    const {body} = req
    const {username, name, password} = body
  
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({
      username,
      name,
      passwordHash
    })
  
    const savedUser = await user.save()
    res.status(201).json(savedUser)
  } catch (err) {
    res.status(400).json({error: err})
  }
})

module.exports = usersRouter