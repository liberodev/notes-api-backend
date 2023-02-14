const { app } = require('../index')
const supertest = require('supertest')
const User = require('../models/User')
const api = supertest(app)

const initialNotes = [
  {
    content: 'MongoDB es increible',
    date: new Date(),
    important: true
  },
  {
    content: 'MongoDB es una herramienta tremenda para trabajar con Node.js',
    date: new Date(),
    important: false
  },
  {
    content: 'Es una maravilla aprender Node.js y MongoDB con midudev',
    date: new Date(),
    important: true
  }
]

const getAllContentFromNote = async () => {
  const response = await api.get('/api/notes')
  return {
    contents: response.body.map(note => note.content),
    response
  }
}

const getUsers = async () => {
  const usersDB = await User.find({})
  return usersDB.map(user => user.toJSON())
}

module.exports = {
  initialNotes,
  api,
  getAllContentFromNote,
  getUsers
}