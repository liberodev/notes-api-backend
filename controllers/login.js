require('dotenv').config()

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/User')

loginRouter.post('/', async (req, res) => {
  const { body } = req
  const { username, password } = body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  // No separar en el error entre user y password el error, para no dar pistas a posibles hackeos
  if (!(user && passwordCorrect)) {
    res.status(401).json({
      error: 'invalid user or password'
    })
  }

  const userForToken = {
    id: user._id,
    username: user.username
  }

  const token = jwt.sign(userForToken, process.env.SECRET)
  // Si se quiere indicar al token una fecha de expiración sería de la siguiente forma
  /*
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    {
      expiresIn: 60 * 60 * 24 * 30 // SS - MI - HH * DD...
    }
  )
  */

  res.send({
    name: user.name,
    username: user.username,
    token
  })
})

module.exports = loginRouter