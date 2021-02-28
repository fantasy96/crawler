const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  title: String,
  src: String,
  alt: String,
  caption: String,
})

const Image = mongoose.model('Image', schema)

module.exports = Image
