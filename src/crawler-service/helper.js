const cheerio = require('cheerio')
const got = require('got')
const isFunction = require('lodash/fp/isFunction')

/**
 *
 * @param {Number} ms
 */
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const formatTimeStr = (timeStr, newsURL) => {
  //format str: Chủ nhật, 28/02/2021 - 12:55
  const dateTime = timeStr.split(',')[1]
  const date = dateTime.split('-')[0].trim().split('/').reverse().join('-')
  const time = dateTime.split('-')[1].trim()

  return Date.parse(`${date}T${time}:00.000+07:00`)
}

const extractNewsIdFromURL = (newsURL) => {
  const matchNewsId = newsURL.match(/-(\d+).htm/)
  const newsId = matchNewsId ? matchNewsId[1] : null

  return newsId
}

const fetchImageFromElement = (imageElement) => ($) => {
  return {
    title: fetchElementAttribute('title')($(imageElement)),
    src: fetchElementAttribute('src')($(imageElement)),
    alt: fetchElementAttribute('alt')($(imageElement)),
  }
}

const fetchHTMLFromURL = async (url) => {
  try {
    const response = await got(url, { timeout: 10000 })

    return cheerio.load(response.body)
  } catch (error) {
    console.error(`${url} ERROR: ${error.response.body}`)
  }
}

const extractFromElements = (extractor) => (transform) => (elements) => ($) => {
  const results = elements.map((_, element) => extractor($(element))).get()
  return isFunction(transform) ? transform(results) : results
}

const fetchElementAttribute = (attribute) => (element) =>
  (element.attr && element.attr(attribute)) || null

const fetchElementInnerText = (element) => {
  return (element.text && element.text().trim()) || null
}

const arrayPairsToObject = (arr) =>
  arr.reduce((obj, pair) => ({ ...obj, ...pair }), {})

module.exports = {
  fetchHTMLFromURL,
  extractNewsIdFromURL,
  extractFromElements,
  fetchElementAttribute,
  fetchElementInnerText,
  formatTimeStr,
  fetchImageFromElement,
  arrayPairsToObject,
  sleep,
}
