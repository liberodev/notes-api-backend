const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')

usersRouter.get('/', async (req, res) => {
  // Si no se indican los atributos que se quieren recibir, como segundo parámetro del populate,
  // se recibirán todos los campos. Los campos que se quieren recibir, se tienen que indicar con un valor de 1.
  const users = await User.find({}).populate('notes', {content: 1, date: 1})
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