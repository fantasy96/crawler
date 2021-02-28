const chunk = require('lodash/fp/chunk')
const mongoose = require('mongoose')
const News = require('./models/News')
const Image = require('./models/Image')

const {
  fetchHTMLFromURL,
  extractFromElements,
  fetchElementAttribute,
  fetchElementInnerText,
  fetchImageFromElement,
  arrayPairsToObject,
  formatTimeStr,
  extractNewsIdFromURL,
} = require('./helper.js')
const concurrentRequest = process.env.CONCURRENT_REQUEST
const Queue = require('./queue')
const subjectQueue = new Queue()
const listNewsQueue = new Queue()

const crawl = async (siteConfig) => {
  const baseURL = siteConfig.baseURL
  const subjects = await crawlNewsSubject(baseURL, siteConfig)

  subjectQueue.enQueues(subjects)

  for (;;) {
    const subjects = subjectQueue.deQueue(parseInt(concurrentRequest))

    await Promise.all(
      subjects.map(async (subject) => {
        if (subject.href === 'https://video.vnexpress.net') {
          await crawlListNews(subject, siteConfig)
        } else {
          await crawlListNews(subject, siteConfig)
        }
      })
    )

    if (subjectQueue.isEmpty()) break
  }

  const listNewsChunk = chunk(concurrentRequest, listNewsQueue.getQueueItem())

  for (let index = 0; index < listNewsChunk.length; index++) {
    const newsContentsChunk = await Promise.all(
      listNewsChunk[index].map(async (news) => {
        const { href } = news
        const newsId = extractNewsIdFromURL(href)
        const newsInfo = await News.findOne({ newsId })

        if (!newsInfo) {
          const newsContent = await crawlNewsContent(news, siteConfig)

          return newsContent
        }
        return null
      })
    )

    const validNewsContents = newsContentsChunk.filter((news) => news)
    const newsContentsFormatted = await formatNewsContents(validNewsContents)
    await News.insertMany(newsContentsFormatted)
  }
}

const formatNewsContents = async (newsContents, baseURL) => {
  const newContentsFormatted = await Promise.all(
    newsContents.map(async (news) => {
      const { images } = news
      const imagesObj = await Image.insertMany(images)
      const imageIds = imagesObj.map(({ _id }) => {
        return _id
      })
      return { ...news, site: baseURL, images: imageIds }
    })
  )

  return newContentsFormatted
}

const crawlNewsSubject = async (siteURL, siteConfig) => {
  const $ = await fetchHTMLFromURL(siteURL)

  const elements = $(siteConfig.subjectsTag)
  const filterSubject = (subjects) => {
    return subjects.filter((subject) => {
      return (
        subject.href &&
        subject.href !== '/' &&
        subject.href !== 'javascript:;' &&
        subject.text
      )
    })
  }
  const formatSubject = (element) => {
    return {
      href: fetchElementAttribute('href')($(element)),
      text: fetchElementInnerText($(element)),
    }
  }
  const subjects = extractFromElements(formatSubject)(filterSubject)(elements)(
    $
  )

  return subjects
}

const crawlListNews = async (subject, siteConfig) => {
  const { href, text } = subject

  const subjectURL =
    href === 'https://video.vnexpress.net'
      ? href
      : `${siteConfig.baseURL}${href}`
  const $ = await fetchHTMLFromURL(subjectURL)

  const elements = $(siteConfig.listNewsTag)
  const formatListNews = (element) => {
    return {
      subjectTitle: text,
      subjectURL,
      href: fetchElementAttribute('href')($(element)),
    }
  }
  const listNewsInPage = extractFromElements(formatListNews)()(elements)($)
  listNewsQueue.enQueues(listNewsInPage)

  const nextPageURL = fetchElementAttribute('href')(
    $(siteConfig.nextPageTag).last()
  )

  if (
    nextPageURL !== null &&
    nextPageURL !== siteConfig.nextPageTagDisable &&
    `${siteConfig.baseURL}${nextPageURL}` !== subjectURL
  ) {
    subjectQueue.enQueue({
      text,
      href: nextPageURL,
    })
  }
}

const crawlNewsContent = async (news, siteConfig) => {
  const { href, subjectTitle, subjectURL } = news
  const newsURL = `${siteConfig.baseURL}${href}`

  const $ = await fetchHTMLFromURL(newsURL)

  const newsTitle = fetchElementInnerText($(siteConfig.news.titleTag))

  const newsTimePublic = fetchElementInnerText($(siteConfig.news.timePublicTag))

  const newsContent = $(siteConfig.news.contentTag)
    .find('p')
    .map((_, element) => {
      const authorCSS = siteConfig.news.author.cssTag
      const elementCSS = $(element).css()
      if (JSON.stringify(authorCSS) == JSON.stringify(elementCSS)) return ''

      return $(element).text().trim('')
    }, [])
    .get()

  const summary = fetchElementInnerText($(siteConfig.news.summaryTag))

  const newsImages = $(siteConfig.news.images.tag)
    .find(siteConfig.news.images.childTag)
    .map((_, imageElement) => {
      const imageFields = imageElement.children.map((childElement) => {
        if (childElement.name == siteConfig.news.images.imgTag) {
          return fetchImageFromElement(childElement)($)
        }

        if (childElement.name == siteConfig.news.images.imgTag) {
          return { caption: fetchElementInnerText($(childElement)) }
        }
      })

      return arrayPairsToObject(imageFields)
    })
    .get()

  const newsAuthor = fetchElementInnerText($(siteConfig.news.author.tag))

  return {
    title: newsTitle,
    url: newsURL,
    subjectTitle,
    subjectURL,
    summary,
    newsId: extractNewsIdFromURL(newsURL),
    timePublic: newsTimePublic ? formatTimeStr(newsTimePublic, newsURL) : null,
    content: newsContent.join(''),
    images: newsImages,
    author: newsAuthor,
  }
}

module.exports = crawl
