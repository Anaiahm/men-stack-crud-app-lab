const mongoose = require('mongoose')

const bunnySchema = new mongoose.Schema({
  name: { type: String, required: true },
  breed: { type: String, required: true },
  image: String,
})

const Bunny = mongoose.model('Bunny', bunnySchema)
module.exports = Bunny