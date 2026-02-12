type StaticApiData = {
  endpointData?: Record<string, any>
  dynamicData?: {
    effectsBySlug?: Record<string, any>
    articlesBySlug?: Record<string, any>
    blogBySlug?: Record<string, any>
    reportsBySlug?: Record<string, any>
    personsByUrl?: Record<string, any>
    profilesByUsername?: Record<string, any>
    replicationsByUrl?: Record<string, any>
    replicationsByArtist?: Record<string, any>
  }
}

const EMPTY_STATIC_API_DATA: StaticApiData = {
  endpointData: {},
  dynamicData: {}
}

let staticApiDataPromise: Promise<StaticApiData> | null = null

const createHttpError = (statusCode: number, statusMessage: string, data?: Record<string, any>) => {
  const error = new Error(statusMessage) as Error & {
    statusCode?: number
    statusMessage?: string
    data?: Record<string, any>
  }
  error.statusCode = statusCode
  error.statusMessage = statusMessage
  if (data) error.data = data
  return error
}

const parsePath = (request: string) => {
  if (!request) return ''
  try {
    return new URL(request, 'http://localhost').pathname
  } catch {
    return request.split('?')[0] || ''
  }
}

const clone = <T>(value: T): T => {
  if (value === undefined) return value
  return JSON.parse(JSON.stringify(value))
}

const getStaticApiData = async () => {
  if (staticApiDataPromise) return staticApiDataPromise

  staticApiDataPromise = (async () => {
    if (import.meta.server) {
      try {
        const [{ readFile }, { resolve }] = await Promise.all([
          import('node:fs/promises'),
          import('node:path')
        ])
        const json = await readFile(resolve(process.cwd(), 'static/data/api-data.json'), 'utf8')
        return JSON.parse(json) as StaticApiData
      } catch {
        return EMPTY_STATIC_API_DATA
      }
    }

    try {
      return await $fetch<StaticApiData>('/data/api-data.json')
    } catch {
      return EMPTY_STATIC_API_DATA
    }
  })()

  return staticApiDataPromise
}

const getMethod = (options: Record<string, any> = {}) => {
  return String(options.method || 'GET').toUpperCase()
}

const getDynamicMatch = (path: string, dynamicData: StaticApiData['dynamicData']) => {
  const segments = path.split('/').filter(Boolean)

  if (segments.length === 3 && segments[0] === 'api' && segments[1] === 'effects') {
    const effect = dynamicData?.effectsBySlug?.[decodeURIComponent(segments[2])]
    return effect === undefined ? undefined : { effect }
  }

  if (segments.length === 3 && segments[0] === 'api' && segments[1] === 'articles') {
    const article = dynamicData?.articlesBySlug?.[decodeURIComponent(segments[2])]
    if (article === undefined) {
      throw createHttpError(404, 'Article not found')
    }
    return { article }
  }

  if (segments.length === 3 && segments[0] === 'api' && segments[1] === 'blog') {
    const post = dynamicData?.blogBySlug?.[decodeURIComponent(segments[2])]
    if (post === undefined) {
      throw createHttpError(404, 'Post not found')
    }
    return { post }
  }

  if (segments.length === 4 && segments[0] === 'api' && segments[1] === 'reports' && segments[2] === 'slug') {
    const report = dynamicData?.reportsBySlug?.[decodeURIComponent(segments[3])]
    if (report === undefined) {
      throw createHttpError(404, 'Report not found')
    }
    return { report }
  }

  if (segments.length === 3 && segments[0] === 'api' && segments[1] === 'persons') {
    const person = dynamicData?.personsByUrl?.[decodeURIComponent(segments[2])]
    return person === undefined ? undefined : { person }
  }

  if (segments.length === 4 && segments[0] === 'api' && segments[1] === 'profiles' && segments[2] === 'user') {
    const profile = dynamicData?.profilesByUsername?.[decodeURIComponent(segments[3]).toLowerCase()]
    return profile === undefined ? undefined : { profile }
  }

  if (segments.length === 4 && segments[0] === 'api' && segments[1] === 'replications' && segments[2] === 'byartist') {
    const replications = dynamicData?.replicationsByArtist?.[decodeURIComponent(segments[3]).toLowerCase()]
    return replications === undefined ? undefined : { replications }
  }

  if (segments.length === 3 && segments[0] === 'api' && segments[1] === 'replications') {
    const replication = dynamicData?.replicationsByUrl?.[decodeURIComponent(segments[2])]
    return replication === undefined ? undefined : { replication }
  }

  return undefined
}

export const resolveStaticApiRequest = async (request: string, options: Record<string, any> = {}) => {
  const path = parsePath(request)
  if (!path.startsWith('/api/')) return undefined

  const method = getMethod(options)
  const isReadMethod = method === 'GET' || method === 'HEAD' || method === 'OPTIONS'
  if (!isReadMethod) {
    throw createHttpError(405, 'READ_ONLY_MODE', {
      error: {
        name: 'READ_ONLY_MODE',
        message: 'This static build does not accept write operations.'
      }
    })
  }

  const staticApiData = await getStaticApiData()
  const endpointData = staticApiData.endpointData || {}
  const dynamicData = staticApiData.dynamicData || {}

  if (Object.prototype.hasOwnProperty.call(endpointData, path)) {
    return clone(endpointData[path])
  }

  const dynamicMatch = getDynamicMatch(path, dynamicData)
  if (dynamicMatch !== undefined) {
    return clone(dynamicMatch)
  }

  return undefined
}
