const mongoose = require('mongoose')

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env

const connectionString = NODE_ENV === 'test'
  ? MONGO_DB_URI_TEST
  : MONGO_DB_URI

// Conexión MongoDB
mongoose.set('strictQuery', true)
mongoose.connect(connectionString)
  .then(() => {
    console.log('Database connected')
  })
  .catch(err => {
    console.error(err)
  })

process.on('uncaughtException', () => {
  mongoose.connection.close()
})

// Comment for students puposes
if (!connectionString) {
  console.error('Recuerda que tiens que tener un archivo .env con las variables de entorno definidas y el MONGO_DB_URI que servirá de connection string. En las clases usamos MongoDB Atlas, pero puedes usar caulquier base de datos de MongoDB (local inluso)')
}

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
