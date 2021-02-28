const { sleep } = require('./helper')
const sitesConfig = require('./config')
const crawl = require('./crawl')

module.exports = async () => {
  for (let index=1;;index++) {
    console.log(`Time ${index}: Crawling...`)
    //Because after some time crawling, vnexpress.net crashed, my error handling is not good, so I can't continue crawling.
    // await crawl(sitesConfig[1])
    await crawl(sitesConfig[0])
    console.log(`Time ${index}: Complete crawl`)

    await sleep(10000)
  }
}
