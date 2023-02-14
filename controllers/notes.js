const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({})
  res.json(notes)
})

notesRouter.get('/:id', (req, res, next) => {
  const { id } = req.params

  Note.findById(id).then(note => {
    if (note) {
      res.json(note)
    } else {
      res.status(404).end()
    }
  }).catch(err => next(err))
})

notesRouter.put('/:id', (req, res, next) => {
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

notesRouter.post('/', async (req, res, next) => {
  const {
    content,
    important = false,
    userId
  } = req.body

  const user = await User.findById(userId)

  if (!content) {
    return res.status(400).json({
      error: 'required "content" field is missing'
    })
  }

  const newNote = new Note({
    content,
    date: new Date(),
    important,
    user: user._id
  })

  try {
    const savedNote = await newNote.save()

    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    res.json(savedNote)
  } catch (err) {
    next(err)
  }
})

notesRouter.delete('/:id', async (req, res, next) => {
  const { id } = req.params

  try {
    await Note.findByIdAndDelete(id)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

module.exports = notesRouter