import { defineStore } from 'pinia'
import { useApiFetch } from '~/composables/useApiFetch'

const emptyResults = () => ({
  articles: [],
  effects: [],
  reports: [],
  total_results: 0
})

const text = (value: unknown) => String(value || '').toLowerCase()

export const useSearchStore = defineStore('search', {
  state: () => ({
    results: emptyResults(),
    input: '',
    staticIndexLoaded: false,
    staticIndex: {
      articles: [],
      effects: [],
      reports: []
    }
  }),
  actions: {
    set_results(results) {
      if (typeof results === 'object') {
        const { articles, effects, reports, total_results } = results
        this.results = {
          articles,
          effects,
          reports,
          total_results
        }
      } else {
        this.results = emptyResults()
      }
    },
    async loadStaticIndex() {
      if (this.staticIndexLoaded) return

      try {
        const index = await $fetch<any>('/search-index.json')
        if (typeof index === 'object' && index) {
          this.staticIndex = {
            articles: Array.isArray(index.articles) ? index.articles : [],
            effects: Array.isArray(index.effects) ? index.effects : [],
            reports: Array.isArray(index.reports) ? index.reports : []
          }
        } else {
          this.staticIndex = { articles: [], effects: [], reports: [] }
        }
      } finally {
        this.staticIndexLoaded = true
      }
    },
    searchStatic(query) {
      const normalizedQuery = text(query).trim()
      if (!normalizedQuery) {
        this.set_results(emptyResults())
        return
      }

      const effects = this.staticIndex.effects.filter((effect) => {
        const haystack = [
          effect.name,
          effect.summary_raw,
          ...(Array.isArray(effect.tags) ? effect.tags : [])
        ].map(text).join(' ')
        return haystack.includes(normalizedQuery)
      })

      const articles = this.staticIndex.articles.filter((article) => {
        const authorNames = Array.isArray(article.authors)
          ? article.authors.map((author) => `${author.full_name || ''} ${author.alias || ''}`)
          : []
        const haystack = [
          article.title,
          article.subtitle,
          article.short_description,
          ...(Array.isArray(article.tags) ? article.tags : []),
          ...authorNames
        ].map(text).join(' ')
        return haystack.includes(normalizedQuery)
      })

      const reports = this.staticIndex.reports.filter((report) => {
        const substanceNames = Array.isArray(report.substances)
          ? report.substances.map((substance) => `${substance.name || ''} ${substance.dose || ''} ${substance.roa || ''}`)
          : []
        const haystack = [
          report.title,
          report?.subject?.name,
          ...(Array.isArray(report.tags) ? report.tags : []),
          ...substanceNames
        ].map(text).join(' ')
        return haystack.includes(normalizedQuery)
      })

      this.set_results({
        effects,
        reports,
        articles,
        total_results: effects.length + reports.length + articles.length
      })
    },
    change_input(input) {
      if (input) this.input = input
    },
    clear_input() {
      this.input = ''
    },
    async search(query) {
      try {
        const config = useRuntimeConfig()
        const browseOnlyMode = config.public.browseOnlyMode === true || config.public.browseOnlyMode === 'true'

        if (browseOnlyMode) {
          await this.loadStaticIndex()
          this.searchStatic(query)
          return
        }

        const apiFetch = useApiFetch()
        const results = await apiFetch('/api/search', {
          method: 'POST',
          body: { query }
        })
        this.set_results(results)
      } catch (error) {
        throw error
      }
    },
    changeSearch(query) {
      this.change_input(query)
    }
  }
})
