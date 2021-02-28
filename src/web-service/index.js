require('./database')()
const express = require('express')
const promiseRouter = require('express-promise-router')
const nnnRouter = require('nnn-router')
const bodyParser = require('body-parser')
const app = express()

const server = require('http').createServer(app)
const io = require('socket.io')(server)
const { readNews } = require('./newsHandler')
app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }))
app.use(
  nnnRouter({ routeDir: '/routes', baseRouter: promiseRouter() }),
  (error, req, res, next) => {
    console.error(error)
    return res.sendStatus(500)
  }
)

const port = process.env.PORT || 8001

server.listen(port, () => {
  console.log(`HttpServer/WebSocketServer is running at port ${port}`)
})

const onConnection = (socket) => {
  socket.on('news:read', async (subject) => await readNews(socket, subject))
}

io.on('connection', onConnection)
