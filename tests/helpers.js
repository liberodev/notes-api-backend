const { app } = require('../index')
const supertest = require('supertest')
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

module.exports = {
  initialNotes,
  api,
  getAllContentFromNote
}