require('dotenv').config()
require('./mongo.js')

const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/Note')

app.use(cors())
app.use(express.json())

let notes = []

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes)
  })
})

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find(note => note.id === id)

  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter(note => note.id !== id)

  res.status(204).end()
})

app.post('/api/notes', (req, res) => {
  const note = req.body

  if (!note || !note.content) {
    return res.status(400).json({
      error: 'required "content" field is missing'
    })
  }

  const newNote = new Note ({
    content: note.content,
    date: new Date(),
    note: note.important || false
  })

  newNote.save().then(savedNote => {
    res.status(201).json(savedNote)
  })
})

app.use((req, res) => {
  res.status(404).json({
    error: 'Not found'
  })
})

const PORT = process.env.PORT || 4001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
