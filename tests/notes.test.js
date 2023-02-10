const mongoose = require('mongoose')

const { server } = require('../index')
const Note = require('../models/Note')
const { initialNotes, api, getAllContentFromNote } = require('./helpers')

beforeEach(async () => {
  await Note.deleteMany({})

  // en paralelo - Es más rápido que el 'for... of', pero no mantiene un orden al guardar.
  // const notesObjects = initialNotes.map(note => newNote(note))
  // const promises = notesObjects.map(note => note.save())
  // await Promise.all(promises)

  // secuencial - Se van guardando en el mismo orden, pero es algo más lento.
  for (const note of initialNotes) {
    const noteObject = new Note(note)
    await noteObject.save()
  }
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
})

test('there are three notes', async () => {
  const response = await api.get('/api/notes')
  expect(response.body).toHaveLength(initialNotes.length)
})

test('the first note is about MongoDB', async () => {
  const {contents} = await getAllContentFromNote()
  expect(contents).toContain('MongoDB es increible')
})

test('a valid note can be added', async () => {
  const newNote = {
    content: 'Proximamente async/await',
    important: false
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(200) // No entiendo que pida el 200, cuando el 'created' es el 201
    .expect('Content-Type', /application\/json/)
  
  const {contents} = await getAllContentFromNote()

  expect(contents).toContain(newNote.content)
})

test('note without content is not added', async () => {
  const newNote = {
    important: false
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)
  
  const {response} = await getAllContentFromNote()
  
  expect(response.body).toHaveLength(initialNotes.length)
})

test('a note can be deleted', async () => {
  const { response: firstResponse } = await getAllContentFromNote()
  const { body: notes } = firstResponse
  const noteToDelete = notes[0]

  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)
  
  const { contents, response: secondResponse } = await getAllContentFromNote()
  expect(secondResponse.body).toHaveLength(initialNotes.length - 1)

  expect(contents).not.toContain(noteToDelete.content)
})

test('a note that do not exist can not be deleted', async () => {
  await api
    .delete('/api/notes/1234')
    .expect(400)
  
  const { response } = await getAllContentFromNote()
  expect(response.body).toHaveLength(initialNotes.length)
})

afterAll(async () => {
  mongoose.connection.close()
  server.close()
})

/*
npm run test
--> Ejecuta lo definido en el package.json

npm run test -- --watch
--> Añade la opción --watch a lo que realmente ejecuta 'npm run test'.

npm run test -- tests/notes.test.js
--> Ejecuta 'npm run test' añadiendo a lo que ejecuta realmente el 'test/notes.test.js' para que solo ejecute ese test. 

npm run test -- tests/notes.test.js -t "there are three notes"
--> Ejecuta el test que tiene esa descripción dentro del notes.test.js. A la hora de poner la descripción no haría falta ponerla completa. También puedes poner una palabra y ejecutará los test que contengan esa palabra.


NOTA: Para añadir opciones a lo que ejecuta por debajo el comando 'npm run test' se debe de poner primero '--'.
*/