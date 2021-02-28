const News = require('./models/News')
const Image = require('./models/Image')

async function readNews(socket, subject) {
  const news = await News.find({ subjectTitle: subject })
    .sort({ timePublic: -1 })
    .populate('images')
    .limit(10)
    .exec()
  if (!news) throw { error: 'No news with this id found' }

  socket.emit('news:read', news)
}

module.exports = { readNews }
