import MarkdownIt from 'markdown-it'

export default defineNuxtPlugin((nuxtApp) => {
  const md = new MarkdownIt({
    linkify: true,
    breaks: true,
    html: true,
    typographer: true,
    quotes: '\u201C\u201D\u2018\u2019'
  })

  nuxtApp.provide('md', md)
})
