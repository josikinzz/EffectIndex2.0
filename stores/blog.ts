import { defineStore } from 'pinia'
import { useApiFetch } from '~/composables/useApiFetch'

export const useBlogStore = defineStore('blog', {
  state: () => ({
    posts: []
  }),
  actions: {
    set_posts(posts) {
      this.posts = posts
    },
    async deletePost(id) {
      const apiFetch = useApiFetch()
      await apiFetch(`/api/blog/${id}/delete`)
      await this.getPosts()
    },
    async getPosts() {
      const apiFetch = useApiFetch()
      const { posts } = await apiFetch('/api/blog')
      this.set_posts(posts)
    },
    async getPost(slug) {
      const apiFetch = useApiFetch()
      const { post } = await apiFetch(`/api/blog/${slug}`)
      return { post }
    },
    async submitPost(post) {
      try {
        const apiFetch = useApiFetch()
        await apiFetch('/api/blog', {
          method: 'POST',
          body: post
        })
        await this.getPosts()
      } catch (error) {
        throw error
      }
    },
    async updatePost(post) {
      const apiFetch = useApiFetch()
      const { post: updatedPost } = await apiFetch(`/api/blog/${post._id}`, {
        method: 'POST',
        body: post
      })
      await this.getPosts()
      return updatedPost
    }
  }
})
