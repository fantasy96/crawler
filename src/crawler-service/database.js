const { connect, connection } = require('mongoose')

module.exports = () => {
  const databaseConnection = {
    host: process.env.MONGODB_HOST,
    port: process.env.MONGODB_PORT,
    user: process.env.MONGODB_USERNAME,
    password: process.env.MONGODB_PASSWORD,
    database: process.env.MONGODB_DATABASE,
  }

  const databaseURL = `mongodb://${databaseConnection.host}:${databaseConnection.port}`

  connect(databaseURL, {
    dbName: databaseConnection.database,
    user: databaseConnection.user,
    pass: databaseConnection.password,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  connection.on('connected', () => {
    console.log('Mongoose connected to DB')
  })
  connection.on('error', (error) => {
    console.error('MongoDB connection error:', error.message)
  })

  connection.on('disconnected', () => {
    console.log('Mongoose disconnected ')
  })
}
