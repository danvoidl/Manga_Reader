import FetchFactory from '../factory'
import type { ApiResp, ListSuccess } from '~/src/types/api'
import { Manga, Tag } from '~/src/types/manga'
import { Chapter, GetChapterImgs } from '~/src/types/manga-chapter'

type SortOrder = 'asc' | 'desc'
type MangaOrder = Record<string, SortOrder>

class PostModule extends FetchFactory<any> {
  async getManga(
    mangaName = '',
    limit = 96,
    order: MangaOrder = { followedCount: 'desc' },
    includedTags: string[] = [],
    createdAtSince = ''
  ): Promise<ApiResp<ListSuccess<Manga[]>>> {
    let query = {
      'includes[]': ['cover_art', 'author'],
      'contentRating[]': ['safe', 'suggestive'],
      'availableTranslatedLanguage[]': 'pt-br',
      limit: limit
    } as Record<string, any>

    // MangaDex expects sorting as order[<field>]=asc|desc
    for (const [field, direction] of Object.entries(order)) {
      query[`order[${field}]`] = direction
    }

    if (mangaName) query['title'] = mangaName
    if (includedTags.length) query['includedTags[]'] = includedTags
    // MangaDex expects createdAtSince as YYYY-MM-DDTHH:MM:SS (no ms / timezone).
    if (createdAtSince) query['createdAtSince'] = createdAtSince

    return this.call({
      method: 'GET',
      url: '/manga',
      fetchOptions: {
        query
      }
    })
  }

  // Look up specific manga by id (with cover_art) — used to resolve covers for
  // the global latest-chapters feed, whose manga relationships carry no cover.
  async getMangasByIds(
    ids: string[]
  ): Promise<ApiResp<ListSuccess<Manga[]>>> {
    return this.call({
      method: 'GET',
      url: '/manga',
      fetchOptions: {
        query: {
          'ids[]': ids,
          'includes[]': ['cover_art'],
          limit: 100
        }
      }
    })
  }

  // Global latest chapter uploads across all manga (order[readableAt]=desc),
  // no language filter — mirrors MangaDex's "Latest Updates" feed.
  async getLatestChapters(
    limit = 30
  ): Promise<ApiResp<ListSuccess<Chapter[]>>> {
    return this.call({
      method: 'GET',
      url: '/chapter',
      fetchOptions: {
        query: {
          'includes[]': ['manga', 'scanlation_group'],
          'contentRating[]': ['safe', 'suggestive'],
          'order[readableAt]': 'desc',
          limit
        }
      }
    })
  }

  async getTags(): Promise<ApiResp<ListSuccess<Tag[]>>> {
    return this.call({
      method: 'GET',
      url: '/manga/tag'
    })
  }

  async getMangaById(id: string): Promise<ApiResp<ListSuccess<Manga>>> {
    return this.call({
      method: 'GET',
      url: `/manga/${id}`,
      fetchOptions: {
        query: {
          'includes[]': ['cover_art', 'author']
        }
      }
    })
  }

  async getMangaChapters(
    mangaId: string,
    translatedLanguages: string[],
    limit = 500
  ): Promise<ApiResp<ListSuccess<Chapter[]>>> {
    const query = {
      'includes[]': 'scanlation_group',
      'translatedLanguage[]': translatedLanguages,
      'order[chapter]': 'desc',
      limit
    }

    return this.call({
      method: 'GET',
      url: `/manga/${mangaId}/feed`,
      fetchOptions: {
        query
      }
    })
  }

  async getMangaChapterImgs(
    chapterId: string
  ): Promise<ApiResp<GetChapterImgs>> {
    const query = {
      forcePort443: false
    }

    return this.call({
      method: 'GET',
      url: `/at-home/server/${chapterId}`,
      fetchOptions: {
        query
      }
    })
  }
}

export default PostModule
