require('dotenv').config()
require('./mongo.js')

const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/Note')
const notFound = require('./middleware/notFound.js')
const handleErrors = require('./middleware/handleErrors.js')

app.use(cors())
app.use(express.json())
app.use('/images', express.static('images'))

Sentry.init({
  dsn: 'https://7fb3569bd6b5464c8e3b5339f671c1cb@o4504639588335616.ingest.sentry.io/4504639591219200',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({
      // to trace all requests to the default router
      app
      // alternatively, you can specify the routes you want to trace:
      // router: someRouter,
    })
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0
})

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
})

app.get('/api/notes', async (req, res) => {
  const notes = await Note.find({})
  res.json(notes)
})

app.get('/api/notes/:id', (req, res, next) => {
  const { id } = req.params

  Note.findById(id).then(note => {
    if (note) {
      res.json(note)
    } else {
      res.status(404).end()
    }
  }).catch(err => next(err))
})

app.put('/api/notes/:id', (req, res, next) => {
  const { id } = req.params
  const note = req.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => {
      res.json(result)
    }).catch(err => next(err))
})

app.delete('/api/notes/:id', async (req, res, next) => {
  const { id } = req.params

  try {
    await Note.findByIdAndDelete(id)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

app.post('/api/notes', async (req, res, next) => {
  const note = req.body

  if (!note || !note.content) {
    return res.status(400).json({
      error: 'required "content" field is missing'
    })
  }

  const newNote = new Note({
    content: note.content,
    date: new Date(),
    important: note.important || false
  })

  // newNote.save().then(savedNote => {
  //   res.status(201).json(savedNote)
  // }).catch(err => next(err))

  try {
    const savedNote = await newNote.save()
    res.json(savedNote)
  } catch (err) {
    next(err)
  }
})

// Es importante el orden de los PATH y los MIDDLEWARE, ya que va de arriba a abajo.
// Poner primero los PATH y luego los MIDDLEWARE sería lo más apropiado
// Este middleware es para controlar que no se ha entrado en ninguna ruta correcta de la API
app.use(notFound)

// Primero dejamos el notFound y luego dejamos que controle Sentry el error
app.use(Sentry.Handlers.errorHandler())
// Este middleware es para controlar los errores que puedan ser comunes bajo un mismo código.
app.use(handleErrors)

const PORT = process.env.PORT || 4001
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
