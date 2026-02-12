import { fromNodeMiddleware } from 'h3'
import { createRequire } from 'module'
import { resolve } from 'node:path'

const require = createRequire(import.meta.url)
const parseBooleanEnv = (value: string | undefined, defaultValue = false) => {
  if (value === undefined) return defaultValue
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase())
}
const browseOnlyMode = parseBooleanEnv(process.env.BROWSE_ONLY_MODE, true)
const backendPath = resolve(process.cwd(), 'backend/index.js')
const expressApp = browseOnlyMode ? null : require(backendPath)

const shouldHandleApiRequest = (url = '') => {
  return url === '/api' || url.startsWith('/api/') || url.startsWith('/api?')
}

export default fromNodeMiddleware((req, res, next) => {
  if (browseOnlyMode || !expressApp) {
    return next()
  }

  if (!shouldHandleApiRequest(req.url || '')) {
    return next()
  }

  return expressApp(req, res, next)
})
