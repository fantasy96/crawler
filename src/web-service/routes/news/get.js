const News = require('../../models/News')
const Image = require('../../models/Image')

module.exports = async (req, res) => {
  const { subject, limit = 10 } = req.query
  const news = await News.find({ subjectTitle: subject })
    .populate('images')
    .sort({ timePublic: -1 })
    .limit(limit)
    .exec()

  return res.status(200).json(news)
}
