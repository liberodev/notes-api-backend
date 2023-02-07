const mongoose = require('mongoose')

const connectionString = process.env.MONGO_DB_URI

// Conexión MongoDB
mongoose.set('strictQuery', true)
mongoose.connect(connectionString)
  .then(() => {
    console.log('Database connected')
  })
  .catch(err => {
    console.error(err)
  })



/* 
Note.find({})
  .then(result => {
    console.log(result)
    mongoose.connection.close()
  })
  .catch(err => {
    console.error(err)
  })

const note = new Note({
  content: 'MongoDB es una herramienta tremenda para trabajar con Node.js',
  date: new Date(),
  important: true
})

note.save()
  .then(result => {
    console.log(result)
    mongoose.connection.close()
  })
  .catch(err => {
    console.error(err)
  })
*/