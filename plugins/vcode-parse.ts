import parse from '../lib/vcode2/parse'

export default defineNuxtPlugin((nuxtApp) => {
  const vcode = (text: string) => parse(text)
  nuxtApp.provide('vcode', vcode)
})
