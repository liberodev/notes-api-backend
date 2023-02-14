const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const usersSchema = new Schema({
  username: { type: String, unique: true },
  name: String,
  passwordHash: String,
  notes: [{
    type: Schema.Types.ObjectId,
    ref: 'Note'
  }]
})

usersSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    // Nunca se debe de devolver una contraseña, aunque esté encriptada
    delete returnedObject.passwordHash
  }
})

usersSchema.plugin(uniqueValidator)

const User = model('User', usersSchema)

module.exports = User
