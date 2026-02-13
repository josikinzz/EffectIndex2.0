import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { $fetch } from 'ofetch'

const parseBooleanEnv = (value: string | undefined, defaultValue = false) => {
  if (value === undefined) return defaultValue
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase())
}

const isAccountPath = (path: string) => {
  return path === '/admin' || path.startsWith('/admin/') || path === '/user' || path.startsWith('/user/')
}

const stripAccountPages = (pages: Array<{ path: string; children?: any[] }>) => {
  for (let index = pages.length - 1; index >= 0; index -= 1) {
    const page = pages[index]
    if (isAccountPath(page.path)) {
      pages.splice(index, 1)
      continue
    }

    if (Array.isArray(page.children) && page.children.length > 0) {
      stripAccountPages(page.children as Array<{ path: string; children?: any[] }>)
    }
  }
}

const loadPrerenderRoutes = (manifestPath: string) => {
  if (!existsSync(manifestPath)) {
    console.warn(`[nuxt] No prerender route manifest found at ${manifestPath}. Run "npm run build:static-data" before "npm run generate".`)
    return ['/']
  }

  try {
    const parsed = JSON.parse(readFileSync(manifestPath, 'utf8'))
    if (!Array.isArray(parsed)) return ['/']

    const normalized = parsed.filter((route) => typeof route === 'string' && route.startsWith('/'))
    return Array.from(new Set(['/'].concat(normalized)))
  } catch (error) {
    console.warn(`[nuxt] Failed to parse prerender route manifest at ${manifestPath}.`, error)
    return ['/']
  }
}

const baseUrl = (process.env.BASE_URL || '').replace(/\/$/, '')
const browserBaseUrl = (process.env.BROWSER_BASE_URL || baseUrl).replace(/\/$/, '')
const sitemapApiBaseUrl = (process.env.SITEMAP_API_BASE_URL || baseUrl).replace(/\/$/, '')
const browseOnlyMode = parseBooleanEnv(process.env.BROWSE_ONLY_MODE, true)
const enableSitemap = parseBooleanEnv(process.env.ENABLE_SITEMAP, false)
const defaultSiteDescription = 'A resource dedicated to establishing the field of formalised subjective effect documentation.'
const prerenderRoutes = loadPrerenderRoutes(resolve(process.cwd(), '.generated/prerender-routes.json'))
const require = createRequire(import.meta.url)
const backendPath = resolve(process.cwd(), 'backend/index.js')

export default defineNuxtConfig({
  telemetry: false,
  compatibilityDate: '2026-02-06',
  devtools: {
    enabled: false
  },
  experimental: {
    appManifest: false
  },
  dir: {
    public: 'static'
  },
  app: {
    head: {
      titleTemplate: (titleChunk?: string | null) => {
        if (!titleChunk || titleChunk === 'Effect Index') return 'Effect Index'
        return `${titleChunk} - Effect Index`
      },
      title: 'Effect Index',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: defaultSiteDescription },
        { hid: 'og:title', property: 'og:title', content: 'Effect Index' },
        { hid: 'og:description', property: 'og:description', content: defaultSiteDescription },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        { hid: 'og:url', property: 'og:url', content: 'https://effectindex.com' },
        { hid: 'og:image', property: 'og:image', content: 'https://effectindex.com/logo-letter.png' },
        { hid: 'twitter:card', name: 'twitter:card', content: 'summary' },
        { hid: 'twitter:title', name: 'twitter:title', content: 'Effect Index' },
        { hid: 'twitter:description', name: 'twitter:description', content: defaultSiteDescription },
        { hid: 'twitter:image', name: 'twitter:image', content: 'https://effectindex.com/logo-letter.png' },
        { hid: 'twitter:image:alt', name: 'twitter:image:alt', content: 'Effect Index Logo' }
      ],
      link: [
        {
          rel: 'stylesheet',
          type: 'text/css',
          href: 'https://fonts.googleapis.com/css?family=Titillium+Web:400i,700,700i,400'
        }
      ],
      script: [
        { src: 'https://challenges.cloudflare.com/turnstile/v0/api.js', async: true, defer: true }
      ]
    }
  },
  css: [],
  modules: [
    '@pinia/nuxt',
    ...(enableSitemap ? ['@nuxtjs/sitemap'] : []),
    '@vite-pwa/nuxt',
    'nuxt-gtag'
  ],
  site: {
    url: 'https://www.effectindex.com',
    name: 'Effect Index'
  },
  runtimeConfig: {
    jwtSecret: process.env.jwtSecret || '',
    sendGridApiKey: process.env.SENDGRID_API_KEY || '',
    mongooseUri: process.env.MONGOOSE_URI || `mongodb://localhost:27017/${process.env.DATABASE_NAME ? process.env.DATABASE_NAME : 'effectindex'}`,
    public: {
      baseURL: baseUrl,
      browserBaseURL: browserBaseUrl,
      cfSiteKey: process.env.CF_SITE_KEY || '',
      gaMeasurementId: process.env.GA_MEASUREMENT_ID || '',
      browseOnlyMode
    }
  },
  gtag: {
    id: process.env.GA_MEASUREMENT_ID || ''
  },
  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*$/,
          handler: 'CacheFirst',
          method: 'GET',
          options: { cacheableResponse: { statuses: [0, 200] } }
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*$/,
          handler: 'CacheFirst',
          method: 'GET',
          options: { cacheableResponse: { statuses: [0, 200] } }
        }
      ]
    }
  },
  ...(enableSitemap
    ? {
        sitemap: {
          exclude: ['/admin/**', '/user/**'],
          urls: async () => {
            try {
              if (!sitemapApiBaseUrl) {
                console.warn('Could not generate sitemap: set SITEMAP_API_BASE_URL or BASE_URL to enable dynamic sitemap routes.')
                return []
              }

              const [effectsRes, articlesRes, postsRes, reportsRes] = await Promise.all([
                $fetch(`${sitemapApiBaseUrl}/api/effects`),
                $fetch(`${sitemapApiBaseUrl}/api/articles`),
                $fetch(`${sitemapApiBaseUrl}/api/blog`),
                $fetch(`${sitemapApiBaseUrl}/api/reports`)
              ])

              const { effects } = effectsRes as { effects: Array<{ url: string }> }
              const { articles } = articlesRes as { articles: Array<{ slug: string }> }
              const { posts } = postsRes as { posts: Array<{ slug: string }> }
              const { reports } = reportsRes as { reports: Array<{ slug: string }> }

              return [
                ...effects.map(effect => `/effects/${effect.url}`),
                ...reports.map(report => `/reports/${report.slug}`),
                ...posts.map(post => `/blog/${post.slug}`),
                ...articles.map(article => `/articles/${article.slug}`)
              ]
            } catch (error) {
              console.error('Could not generate sitemap.', error)
              return []
            }
          }
        }
      }
    : {}),
  hooks: {
    'pages:extend'(pages) {
      if (!browseOnlyMode) return
      stripAccountPages(pages as Array<{ path: string; children?: any[] }>)
    }
  },
  nitro: {
    prerender: {
      crawlLinks: false,
      failOnError: false,
      routes: prerenderRoutes,
      ignore: ['/admin/**', '/user/**']
    },
    hooks: {
      close: async () => {
        const cachedBackend = require.cache?.[backendPath]?.exports as { shutdown?: () => Promise<void> } | undefined
        if (cachedBackend?.shutdown) {
          await cachedBackend.shutdown()
        }
      }
    }
  }
})
