const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  newsId: { type: Number, index: true },
  site: String,
  title: String,
  summary: String,
  author: String,
  content: String,
  url: String,
  subjectTitle: String,
  subjectURL: String,
  timePublic: { type: Date, default: Date.now },
  requestAt: { type: Date, default: Date.now },
  images: [{ type: Schema.ObjectId, ref: 'Image' }],
})

const News = mongoose.model('News', schema)

module.exports = News
