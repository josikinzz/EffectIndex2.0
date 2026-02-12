import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import parseVcode from '../lib/vcode2/parse.js'
import DocumentParser from '../lib/DocumentParser.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
const dumpDir = resolve(rootDir, 'effectindex_dump')
const require = createRequire(import.meta.url)

dotenv.config({ path: resolve(rootDir, '.env') })

const mongoUri =
  process.env.MONGOOSE_URI ||
  `mongodb://localhost:27017/${process.env.DATABASE_NAME ? process.env.DATABASE_NAME : 'effectindex'}`
const staticDataApiBaseUrl = (process.env.STATIC_DATA_API_BASE_URL || process.env.SITEMAP_API_BASE_URL || '').replace(/\/$/, '')

const STATIC_ROUTES = [
  '/',
  '/about',
  '/articles',
  '/blog',
  '/categories',
  '/clinical',
  '/contact',
  '/copyright-disclaimer',
  '/discord',
  '/documentation-style-guide',
  '/donate',
  '/effects',
  '/methodology/approximate-frequency-of-occurence-scale',
  '/methodology/duration-terminology',
  '/people',
  '/profiles',
  '/replications',
  '/replications/audio',
  '/replications/tutorials',
  '/reports',
  '/search',
  '/summaries',
  '/summaries/deliriants',
  '/summaries/dissociatives',
  '/summaries/psychedelics/cognitive',
  '/summaries/psychedelics/miscellaneous',
  '/summaries/psychedelics/visual'
]

const PUBLIC_ARTICLE_STATUSES = new Set(['published', 'unlisted'])

const ensureArray = (value) => (Array.isArray(value) ? value : [])
const slugify = (value) => String(value || '').trim().toLowerCase()
const legacyDocumentParser = new DocumentParser()

const LEGACY_VCODE_PATTERN = /##[a-zA-Z\-]+(?:\|[a-zA-Z]*=\"[\s\S]*?\")?(?:\{[\s\S]*?\})?/

const parseJsonArray = (value) => {
  if (Array.isArray(value)) return value
  if (typeof value !== 'string') return null

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : null
  } catch (error) {
    return null
  }
}

const hasLegacyTokens = (value) => typeof value === 'string' && LEGACY_VCODE_PATTERN.test(value)

const isLegacyNodeObject = (node) => {
  return Boolean(
    node &&
      typeof node === 'object' &&
      !Array.isArray(node) &&
      'type' in node &&
      !('name' in node)
  )
}

const containsLegacyNode = (nodes) => {
  if (!Array.isArray(nodes)) return false
  return nodes.some((node) => (typeof node === 'string' && hasLegacyTokens(node)) || isLegacyNodeObject(node))
}

const stringifyVcodeProps = (props) => {
  if (!props || typeof props !== 'object') return ''
  return Object.entries(props)
    .map(([key, value]) => ` ${key}="${String(value).replaceAll('"', '&quot;')}"`)
    .join('')
}

const makeVcodeTag = (name, props, value) => {
  if (typeof value === 'string') {
    return `[${name}${stringifyVcodeProps(props)}]${value}[/${name}]`
  }
  return `[${name}${stringifyVcodeProps(props)} /]`
}

const legacyNodesToVcode = (parsedLegacy) => {
  let output = ''

  for (const node of parsedLegacy) {
    if (typeof node === 'string') {
      output += hasLegacyTokens(node) ? legacyNodesToVcode(legacyDocumentParser.parse(node)) : node
      continue
    }

    const type = node?.type
    const value = typeof node?.value === 'string' ? node.value : undefined
    const props = node?.props && typeof node.props === 'object' ? node.props : undefined

    switch (type) {
      case 'string':
        output += value || ''
        break
      case 'int-link':
        output += makeVcodeTag('int-link', props, value)
        break
      case 'cap-img':
        output += makeVcodeTag('captioned-image', props)
        break
      case 'i':
      case 'b':
      case 'u':
        output += makeVcodeTag(type, props, value)
        break
      case 'ref':
        output += makeVcodeTag('ref', props)
        break
      case 'headered-textbox':
        output += makeVcodeTag('headered-textbox', props, value)
        break
      case 'separated-textbox':
        output += makeVcodeTag('separated-textbox', props, value)
        break
      case 'quotation':
        output += makeVcodeTag('quote', props, value)
        break
      case 'subarticle':
        output += makeVcodeTag('subarticle', props, value)
        break
      case 'md':
        output += makeVcodeTag('markdown', undefined, value || '')
        break
      case 'audio':
        output += makeVcodeTag('audio', props)
        break
      case 'ext-link': {
        const extLinkProps = props?.href && !props?.to ? { ...props, to: props.href } : props
        output += makeVcodeTag('ext-link', extLinkProps, value)
        break
      }
      case 'horizontal-line':
        output += makeVcodeTag('hr')
        break
      default:
        output += value || ''
        break
    }
  }

  return output
}

const convertLegacyToVcode = (legacyVcode) => legacyNodesToVcode(legacyDocumentParser.parse(legacyVcode))

const parseVcodeSafe = (value) => {
  try {
    return parseVcode(value)
  } catch (error) {
    return null
  }
}

const resolveParsedVcode = (raw, parsedCandidate) => {
  const parsedArray = parseJsonArray(parsedCandidate)

  if (parsedArray && !containsLegacyNode(parsedArray)) {
    return parsedArray
  }

  if (parsedArray && containsLegacyNode(parsedArray)) {
    const convertedFromParsed = legacyNodesToVcode(parsedArray)
    const parsedFromLegacyArray = parseVcodeSafe(convertedFromParsed)
    if (parsedFromLegacyArray) return parsedFromLegacyArray
  }

  if (typeof raw !== 'string' || !raw.length) {
    return parsedArray || []
  }

  if (hasLegacyTokens(raw)) {
    const converted = convertLegacyToVcode(raw)
    const legacyParsed = parseVcodeSafe(converted)
    if (legacyParsed) return legacyParsed
  }

  const rawParsed = parseVcodeSafe(raw)
  if (rawParsed) return rawParsed

  return parsedArray || []
}

const normalizeVcodeField = (record, field) => {
  const value = record[field]
  const raw = value?.raw || record[`${field}_raw`] || ''
  const parsedCandidate =
    value?.parsed ??
    record[`${field}_formatted`] ??
    (typeof value === 'string' ? value : '[]')
  const parsed = resolveParsedVcode(raw, parsedCandidate)

  return {
    raw,
    parsed: JSON.stringify(parsed),
    length: typeof raw === 'string' ? raw.length : 0
  }
}
const hasAnyContent = (data) => {
  return (
    ensureArray(data.effects).length > 0 ||
    ensureArray(data.articles).length > 0 ||
    ensureArray(data.reports).length > 0 ||
    ensureArray(data.posts).length > 0
  )
}

const withPathPrefix = (prefix, values) => {
  return values
    .filter((value) => typeof value === 'string' && value.length)
    .map((value) => `${prefix}/${value}`)
}

const writeJson = async (path, data) => {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

const normalizeExtendedJson = (value) => {
  if (Array.isArray(value)) {
    return value.map(normalizeExtendedJson)
  }

  if (!value || typeof value !== 'object') {
    return value
  }

  if (Object.keys(value).length === 1) {
    if ('$oid' in value) return String(value.$oid)
    if ('$date' in value) {
      const dateValue = value.$date
      if (typeof dateValue === 'number') return new Date(dateValue).toISOString()
      if (typeof dateValue === 'string') return dateValue
      return dateValue
    }
    if ('$numberInt' in value) return Number(value.$numberInt)
    if ('$numberLong' in value) return Number(value.$numberLong)
    if ('$numberDouble' in value) return Number(value.$numberDouble)
  }

  const normalized = {}
  for (const [key, nested] of Object.entries(value)) {
    normalized[key] = normalizeExtendedJson(nested)
  }
  return normalized
}

const normalizeVcode = (record, field) => {
  return normalizeVcodeField(record, field)
}

const readDumpFile = async (fileName) => {
  const fullPath = resolve(dumpDir, fileName)
  if (!existsSync(fullPath)) return []
  const json = await readFile(fullPath, 'utf8')
  const parsed = JSON.parse(json)
  return ensureArray(normalizeExtendedJson(parsed))
}

const loadFromDump = async () => {
  const requiredFiles = ['effects.json', 'articles.json', 'reports.json']
  if (!requiredFiles.every((file) => existsSync(resolve(dumpDir, file)))) {
    return null
  }

  const [effectsRaw, articlesRaw, postsRaw, reportsRaw, peopleRaw, profilesRaw, replicationsRaw, redirectsRaw] = await Promise.all([
    readDumpFile('effects.json'),
    readDumpFile('articles.json'),
    readDumpFile('posts.json'),
    readDumpFile('reports.json'),
    readDumpFile('people.json'),
    readDumpFile('profiles.json'),
    readDumpFile('replications.json'),
    readDumpFile('redirects.json')
  ])

  const peopleById = new Map(peopleRaw.map((person) => [String(person._id), person]))
  const effectsById = new Map(effectsRaw.map((effect) => [String(effect._id), effect]))

  const effects = effectsRaw.map((effect) => ({
    ...effect,
    tags: ensureArray(effect.tags),
    citations: ensureArray(effect.citations),
    see_also: ensureArray(effect.see_also),
    external_links: ensureArray(effect.external_links),
    contributors: ensureArray(effect.contributors),
    gallery_order: ensureArray(effect.gallery_order),
    subarticles: ensureArray(effect.subarticles),
    toc: ensureArray(effect.toc),
    description: normalizeVcode(effect, 'description'),
    long_summary: normalizeVcode(effect, 'long_summary'),
    analysis: normalizeVcode(effect, 'analysis'),
    style_variations: normalizeVcode(effect, 'style_variations'),
    personal_commentary: normalizeVcode(effect, 'personal_commentary')
  }))

  const articles = articlesRaw
    .filter((article) => PUBLIC_ARTICLE_STATUSES.has(article.publication_status))
    .map((article) => ({
      ...article,
      authors: ensureArray(article.authors)
        .map((authorId) => peopleById.get(String(authorId)))
        .filter(Boolean),
      tags: ensureArray(article.tags),
      citations: ensureArray(article.citations),
      body: {
        raw: article.body?.raw || '',
        parsed: article.body?.parsed || [],
        length: article.body?.length || 0
      }
    }))

  const posts = postsRaw
    .map((post) => ({ ...post }))
    .sort((a, b) => String(b.datetime || '').localeCompare(String(a.datetime || '')))

  const reports = reportsRaw.map((report) => ({
    ...report,
    tags: ensureArray(report.tags),
    substances: ensureArray(report.substances),
    onset: ensureArray(report.onset),
    peak: ensureArray(report.peak),
    offset: ensureArray(report.offset),
    related_effects: ensureArray(report.related_effects)
      .map((effectId) => effectsById.get(String(effectId)))
      .filter(Boolean)
      .map((effect) => ({
        _id: effect._id,
        name: effect.name,
        url: effect.url,
        tags: ensureArray(effect.tags)
      })),
    person: report.person ? (peopleById.get(String(report.person)) || null) : null
  }))

  const people = peopleRaw.map((person) => ({
    ...person,
    social_media: ensureArray(person.social_media),
    tags: ensureArray(person.tags),
    bio: person.bio || { raw: '', parsed: '[]', length: 0 }
  }))

  const profiles = profilesRaw
    .map((profile) => ({ ...profile }))
    .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0))

  const replications = replicationsRaw.map((replication) => ({
    ...replication,
    associated_effects: ensureArray(replication.associated_effects),
    associated_substances: ensureArray(replication.associated_substances),
    person: replication.person ? (peopleById.get(String(replication.person)) || null) : null
  }))

  const redirects = redirectsRaw.map((redirect) => ({ ...redirect }))

  return {
    effects,
    articles,
    posts,
    reports,
    people,
    profiles,
    replications,
    redirects
  }
}

const registerModels = () => {
  require(resolve(rootDir, 'backend/models/persons/Person.js'))
  require(resolve(rootDir, 'backend/models/effects/Effect.js'))
  require(resolve(rootDir, 'backend/models/articles/Article.js'))
  require(resolve(rootDir, 'backend/models/blog/Post.js'))
  require(resolve(rootDir, 'backend/models/reports/Report.js'))
  require(resolve(rootDir, 'backend/models/profiles/Profile.js'))
  require(resolve(rootDir, 'backend/models/replications/Replication.js'))
  require(resolve(rootDir, 'backend/models/redirects/Redirect.js'))
}

const loadFromMongo = async () => {
  registerModels()

  const Effect = mongoose.model('Effect')
  const Article = mongoose.model('Article')
  const Post = mongoose.model('Post')
  const Report = mongoose.model('Report')
  const Person = mongoose.model('Person')
  const Profile = mongoose.model('Profile')
  const Replication = mongoose.model('Replication')
  const Redirect = mongoose.model('Redirect')

  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 })

  try {
    const [effects, articles, posts, reports, people, profiles, replications, redirects] = await Promise.all([
      Effect.find().lean().exec(),
      Article.find({ publication_status: { $in: Array.from(PUBLIC_ARTICLE_STATUSES) } }).populate('authors').lean().exec(),
      Post.find().sort({ datetime: 'desc' }).lean().exec(),
      Report.find().populate('related_effects', 'name url tags').populate('person', 'full_name alias gravatar_hash social_media profile_url').lean().exec(),
      Person.find({ isPrivate: { $ne: true } }).lean().exec(),
      Profile.find().sort({ sortOrder: 'asc' }).lean().exec(),
      Replication.find().populate({ path: 'person', select: '_id alias full_name profile_url' }).lean().exec(),
      Redirect.find({}).sort({ from: 'desc' }).lean().exec()
    ])

    return { effects, articles, posts, reports, people, profiles, replications, redirects }
  } finally {
    await mongoose.disconnect()
  }
}

const fetchJson = async (baseUrl, path) => {
  const response = await fetch(`${baseUrl}${path}`)
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${path}`)
  }
  return response.json()
}

const fetchOptionalJson = async (baseUrl, path) => {
  try {
    return await fetchJson(baseUrl, path)
  } catch (error) {
    console.warn(`[static-data] Failed to fetch ${path}: ${error.message}`)
    return null
  }
}

const fetchDetailsBySlug = async (baseUrl, values, buildPath, resultKey) => {
  const entries = await Promise.all(
    values.map(async (value) => {
      const payload = await fetchOptionalJson(baseUrl, buildPath(value))
      if (!payload || !payload[resultKey]) return null
      return [value, payload[resultKey]]
    })
  )

  return Object.fromEntries(entries.filter(Boolean))
}

const loadFromApi = async (baseUrl) => {
  const [effectsRes, articlesRes, postsRes, reportsRes, peopleRes, profilesRes, replicationsRes, redirectsRes] = await Promise.all([
    fetchOptionalJson(baseUrl, '/api/effects'),
    fetchOptionalJson(baseUrl, '/api/articles'),
    fetchOptionalJson(baseUrl, '/api/blog'),
    fetchOptionalJson(baseUrl, '/api/reports'),
    fetchOptionalJson(baseUrl, '/api/persons'),
    fetchOptionalJson(baseUrl, '/api/profiles'),
    fetchOptionalJson(baseUrl, '/api/replications'),
    fetchOptionalJson(baseUrl, '/api/redirects')
  ])

  const effectsList = ensureArray(effectsRes?.effects)
  const articlesList = ensureArray(articlesRes?.articles)
  const postsList = ensureArray(postsRes?.posts)
  const reportsList = ensureArray(reportsRes?.reports)
  const peopleList = ensureArray(peopleRes?.people)
  const profilesList = ensureArray(profilesRes?.profiles)
  const replicationsList = ensureArray(replicationsRes?.replications)
  const redirectsList = ensureArray(redirectsRes?.redirects)

  const [effectsBySlug, articlesBySlug, postsBySlug, reportsBySlug, personsByUrl] = await Promise.all([
    fetchDetailsBySlug(baseUrl, effectsList.map((effect) => effect.url).filter(Boolean), (slug) => `/api/effects/${encodeURIComponent(slug)}`, 'effect'),
    fetchDetailsBySlug(baseUrl, articlesList.map((article) => article.slug).filter(Boolean), (slug) => `/api/articles/${encodeURIComponent(slug)}`, 'article'),
    fetchDetailsBySlug(baseUrl, postsList.map((post) => post.slug).filter(Boolean), (slug) => `/api/blog/${encodeURIComponent(slug)}`, 'post'),
    fetchDetailsBySlug(baseUrl, reportsList.map((report) => report.slug).filter(Boolean), (slug) => `/api/reports/slug/${encodeURIComponent(slug)}`, 'report'),
    fetchDetailsBySlug(baseUrl, peopleList.map((person) => person.profile_url).filter(Boolean), (slug) => `/api/persons/${encodeURIComponent(slug)}`, 'person')
  ])

  return {
    effects: effectsList.map((effect) => effectsBySlug[effect.url] || effect),
    articles: articlesList.map((article) => articlesBySlug[article.slug] || article),
    posts: postsList.map((post) => postsBySlug[post.slug] || post),
    reports: reportsList.map((report) => reportsBySlug[report.slug] || report),
    people: peopleList.map((person) => personsByUrl[person.profile_url] || person),
    profiles: profilesList,
    replications: replicationsList,
    redirects: redirectsList
  }
}

const buildCanonicalData = (rawData) => {
  const effects = ensureArray(rawData.effects)
    .map((effect) => ({
      ...effect,
      description: normalizeVcodeField(effect, 'description'),
      long_summary: normalizeVcodeField(effect, 'long_summary'),
      analysis: normalizeVcodeField(effect, 'analysis'),
      style_variations: normalizeVcodeField(effect, 'style_variations'),
      personal_commentary: normalizeVcodeField(effect, 'personal_commentary')
    }))
  const articlesAll = ensureArray(rawData.articles).filter((article) => PUBLIC_ARTICLE_STATUSES.has(article.publication_status))
    .map((article) => ({
      ...article,
      body: normalizeVcodeField(article, 'body')
    }))
  const posts = ensureArray(rawData.posts)
  const reportsAll = ensureArray(rawData.reports)
  const people = ensureArray(rawData.people).filter((person) => person?.isPrivate !== true)
  const profiles = ensureArray(rawData.profiles)
  const replications = ensureArray(rawData.replications)
  const redirects = ensureArray(rawData.redirects)

  const reports = reportsAll.filter((report) => report && report.unpublished !== true)

  const effectsById = new Map(effects.map((effect) => [String(effect._id), effect]))

  const replicationsSorted = [...replications].sort((a, b) => {
    const typeA = String(a?.type || '')
    const typeB = String(b?.type || '')
    return typeA < typeB ? 1 : typeA > typeB ? -1 : 0
  })

  const replicationsByArtist = {}
  replicationsSorted.forEach((replication) => {
    const key = slugify(replication?.artist)
    if (!key) return
    if (!replicationsByArtist[key]) replicationsByArtist[key] = []
    replicationsByArtist[key].push(replication)
  })

  const replicationsByUrl = Object.fromEntries(
    replicationsSorted
      .filter((replication) => replication && replication.url)
      .map((replication) => [replication.url, replication])
  )

  const effectDetailsBySlug = {}
  effects.forEach((effect) => {
    if (!effect || !effect.url) return

    const effectId = String(effect._id)
    const associatedReplications = replicationsSorted.filter((replication) =>
      ensureArray(replication.associated_effects).map(String).includes(effectId)
    )

    const relatedReports = reports
      .filter((report) =>
        ensureArray(report.related_effects)
          .map((relatedEffect) => (typeof relatedEffect === 'string' ? relatedEffect : String(relatedEffect?._id || relatedEffect)))
          .includes(effectId)
      )
      .map((report) => ({
        _id: report._id,
        title: report.title,
        subject: report.subject,
        substances: report.substances,
        slug: report.slug,
        featured: report.featured
      }))

    effectDetailsBySlug[effect.url] = {
      ...effect,
      replications: associatedReplications.filter((replication) => ['image', 'gfycat'].includes(replication.type)),
      audio_replications: associatedReplications.filter((replication) => replication.type === 'audio'),
      related_reports: relatedReports
    }
  })

  const publishedArticles = articlesAll.filter((article) => article?.publication_status === 'published')
  const articleDetailsBySlug = Object.fromEntries(
    articlesAll.filter((article) => article?.slug).map((article) => [article.slug, article])
  )

  const blogBySlug = Object.fromEntries(posts.filter((post) => post?.slug).map((post) => [post.slug, post]))
  const reportsBySlug = Object.fromEntries(reports.filter((report) => report?.slug).map((report) => [report.slug, report]))
  const peopleByUrl = Object.fromEntries(people.filter((person) => person?.profile_url).map((person) => [person.profile_url, person]))
  const profilesByUsername = Object.fromEntries(profiles.filter((profile) => profile?.username).map((profile) => [String(profile.username).toLowerCase(), profile]))

  const featuredPeople = people.filter((person) => person?.featured === true)
  const featuredReplications = replicationsSorted.filter((replication) => replication?.featured === true)

  const replicatedEffectIds = Array.from(new Set(
    replicationsSorted
      .filter((replication) => ['image', 'gfycat'].includes(replication.type))
      .flatMap((replication) => ensureArray(replication.associated_effects).map(String))
      .filter(Boolean)
  ))

  const replicatedEffects = replicatedEffectIds
    .map((effectId) => effectsById.get(effectId))
    .filter(Boolean)
    .map((effect) => ({
      _id: effect._id,
      name: effect.name,
      gallery_order: effect.gallery_order,
      url: effect.url
    }))

  const endpointData = {
    '/api/effects': { effects },
    '/api/articles': { articles: publishedArticles },
    '/api/blog': { posts },
    '/api/reports': { reports },
    '/api/replications': { replications: replicationsSorted },
    '/api/replications/featured': { replications: featuredReplications },
    '/api/replications/gallery': {
      replications: replicationsSorted,
      replicated_effects: replicatedEffects
    },
    '/api/persons': { people },
    '/api/persons/featured': { people: featuredPeople },
    '/api/profiles': { profiles },
    '/api/redirects': { redirects }
  }

  return {
    endpointData,
    dynamicData: {
      effectsBySlug: effectDetailsBySlug,
      articlesBySlug: articleDetailsBySlug,
      blogBySlug,
      reportsBySlug,
      personsByUrl: peopleByUrl,
      profilesByUsername,
      replicationsByUrl,
      replicationsByArtist
    },
    entities: {
      effects,
      publishedArticles,
      reports,
      profiles
    }
  }
}

const buildRoutes = (canonicalData) => {
  const { dynamicData, entities } = canonicalData

  return Array.from(new Set([
    ...STATIC_ROUTES,
    ...withPathPrefix('/effects', Object.keys(dynamicData.effectsBySlug || {})),
    ...withPathPrefix('/articles', Object.keys(dynamicData.articlesBySlug || {})),
    ...withPathPrefix('/blog', Object.keys(dynamicData.blogBySlug || {})),
    ...withPathPrefix('/reports', Object.keys(dynamicData.reportsBySlug || {})),
    ...withPathPrefix('/people', Object.keys(dynamicData.personsByUrl || {})),
    ...withPathPrefix('/profiles', ensureArray(entities.profiles).map((profile) => profile.username))
  ])).sort()
}

async function resolveRawData() {
  const dumpData = await loadFromDump()
  if (dumpData && hasAnyContent(dumpData)) {
    console.log('[static-data] Using local JSON dump data from effectindex_dump/.')
    return dumpData
  }

  try {
    const mongoData = await loadFromMongo()
    if (hasAnyContent(mongoData)) {
      console.log('[static-data] Using local MongoDB content.')
      return mongoData
    }

    if (staticDataApiBaseUrl) {
      console.warn(`[static-data] Local MongoDB appears empty. Falling back to ${staticDataApiBaseUrl} for static data.`)
      const remoteData = await loadFromApi(staticDataApiBaseUrl)
      if (hasAnyContent(remoteData)) {
        console.log('[static-data] Using remote API content.')
        return remoteData
      }
    }

    return mongoData
  } catch (error) {
    if (staticDataApiBaseUrl) {
      console.warn(`[static-data] MongoDB unavailable (${error.message}). Falling back to ${staticDataApiBaseUrl}.`)
      const remoteData = await loadFromApi(staticDataApiBaseUrl)
      if (hasAnyContent(remoteData)) {
        console.log('[static-data] Using remote API content.')
        return remoteData
      }
    }

    throw error
  }
}

async function run() {
  const rawData = await resolveRawData()
  const canonicalData = buildCanonicalData(rawData)
  const routes = buildRoutes(canonicalData)

  const searchIndex = {
    generatedAt: new Date().toISOString(),
    effects: ensureArray(canonicalData.entities.effects).filter((effect) => effect && effect.url),
    articles: ensureArray(canonicalData.entities.publishedArticles).filter((article) => article && article.slug),
    reports: ensureArray(canonicalData.entities.reports).filter((report) => report && report.slug)
  }

  const staticApiData = {
    generatedAt: new Date().toISOString(),
    endpointData: canonicalData.endpointData,
    dynamicData: canonicalData.dynamicData
  }

  await writeJson(resolve(rootDir, '.generated/prerender-routes.json'), routes)
  await writeJson(resolve(rootDir, 'static/search-index.json'), searchIndex)
  await writeJson(resolve(rootDir, 'static/data/api-data.json'), staticApiData)

  console.log(
    `[static-data] Wrote ${routes.length} prerender routes, static API data, and search index ` +
      `(${searchIndex.effects.length} effects, ${searchIndex.articles.length} articles, ${searchIndex.reports.length} reports).`
  )
}

run().catch((error) => {
  console.error('[static-data] Failed to build static data:', error)
  process.exit(1)
})
