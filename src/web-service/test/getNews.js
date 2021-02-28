const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const io = require('socket.io-client')
const ioClient = io('http://localhost:8001')
const assert = chai.assert

chai.use(chaiHttp)

describe('News', () => {
  describe('/GET news', () => {
    it('it should GET news of subject', (done) => {
      chai
        .request('localhost:8001')
        .get('/news')
        .query({ subject: 'Sự kiện' })
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('array')
          res.body.length.should.be.eql(10)
          done()
        })
    })
  })
})

describe('Get News use websocket', () => {
  it('it should connect to web socket server and get news', (done) => {
    ioClient.emit('news:read', 'Sự kiện')
    ioClient.on('news:read', (msg) => {
      assert.equal(10, msg.length)
      done()
    })
  })
})
