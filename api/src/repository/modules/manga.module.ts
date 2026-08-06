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
    includedTags: string[] = []
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

    return this.call({
      method: 'GET',
      url: '/manga',
      fetchOptions: {
        query
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
