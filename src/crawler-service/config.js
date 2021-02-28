module.exports = [
  {
    baseURL: 'https://dantri.com.vn',
    subjectsTag: 'ol.site-menu__list > li > a',
    listNewsTag: 'a.news-item__sapo',
    nextPageTag: 'ul.list-unstyled.dt-category-actions > li > a',
    nextPageTagDisable: null,
    news: {
      titleTag: 'h1.dt-news__title',
      summaryTag: 'div.dt-news__sapo > h2',
      contentTag: 'div.dt-news__content',
      images: {
        childTag: 'figure',
        tag: 'div.dt-news__content,div.e-magazine__cover',
        imgTag: 'img',
        captionTag: 'figcaption',
      },
      author: {
        tag:
          'p[style="text-align: right;"] > strong,div[style="text-align: right;"] > strong',
        cssTag: { 'text-align': 'right' },
      },
      timePublicTag: 'span.dt-news__time',
    },
  },
  {
    baseURL: 'https://vnexpress.net',
    subjectsTag: 'ul.parent > li > a',
    listNewsTag: 'article.item-news > h3 > a,li > h3.title_news > a',
    nextPageTag: 'div.button-page > a',
    nextPageTagDisable: 'javascript:;',
    news: {
      titleTag: 'h1.tittle-detail',
      summaryTag: '',
      contentTag: 'article.fck_detail',
      images: {
        childTag: 'figure',
        tag: 'div.dt-news__content',
        imgTag: 'img',
        captionTag: 'figcaption',
      },
      author: {
        tag:
          'p[style="text-align: right;"] > strong,div[style="text-align: right;"] > strong',
        cssTag: { 'text-align': 'right' },
      },
      timePublicTag: 'span.dt-news__time',
    },
  },
]
