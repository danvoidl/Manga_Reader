import FetchFactory from '../factory'
import type { ApiResp, ListSuccess } from '~/src/types/api'
import { Manga } from '~/src/types/manga'
import { Chapter, GetChapterImgs } from '~/src/types/manga-chapter'

class PostModule extends FetchFactory<any> {
  async getManga(
    mangaName = '',
    limit = 96
  ): Promise<ApiResp<ListSuccess<Manga[]>>> {
    let query = {
      'includes[]': ['cover_art', 'author'],
      'contentRating[]': ['safe', 'suggestive'],
      'order[followedCount]': 'desc',
      'availableTranslatedLanguage[]': 'pt-br',
      limit: limit
    } as Record<string, any>

    if (mangaName) query['title'] = mangaName

    return this.call({
      method: 'GET',
      url: '/manga',
      fetchOptions: {
        query
      }
    })
  }

  async getMangaChapters(
    mangaId: string
  ): Promise<ApiResp<ListSuccess<Chapter[]>>> {
    const query = {
      'includes[]': 'scanlation_group',
      'order[volume]': 'asc',
      'order[chapter]': 'asc'
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
