import { $fetch, type FetchOptions } from 'ofetch'
import { config } from '../config'

import MangaModule from './modules/manga.module'

export interface ApiModules {
  manga: MangaModule
}

// Build a request-scoped set of repository modules whose HTTP client carries the
// caller's MangaDex access token. Each GraphQL request creates its own instance
// (see the Apollo `context` in src/index.ts) so upstream calls run under the
// identity of the logged-in user.
export function createModules(token: string): ApiModules {
  const fetchOptions: FetchOptions = {
    baseURL: config.BASE_URL,
    onRequest({ options }) {
      options.headers.append('Authorization', `Bearer ${token}`)
    }
  }

  const fetcher = $fetch.create(fetchOptions)

  return {
    manga: new MangaModule(fetcher)
  }
}
