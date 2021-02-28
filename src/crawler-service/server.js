require('./database')()
const scheduleCrawl = require('./scheduleCrawl')

// const cluster = require('cluster')

// let workers = []

// const setupWorkerProcesses = () => {
//   const numCores = require('os').cpus().length
//   for (let coreIndex = 0; coreIndex < numCores; coreIndex++) {
//     workers.push(cluster.fork())

//     workers[coreIndex].on('message', function (message) {
//       console.log(message)
//     })
//   }

//   cluster.on('online', function (worker) {
//     console.log(`Worker ${worker.process.pid} is listening`)
//   })

//   cluster.on('exit', function (worker, code, signal) {
//     console.log(
//       `Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`
//     )
//     console.log('Starting a new worker')
//     workers.push(cluster.fork())
//     workers[workers.length - 1].on('message', function (message) {
//       console.log(message)
//     })
//   })
// }

// const setupServer = (isClusterRequired) => {
//   if (isClusterRequired && cluster.isMaster) {
//     setupWorkerProcesses()
//   } else {
//     crawl()
//   }
// }

scheduleCrawl()
