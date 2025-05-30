import FetchFactory from '../factory'
import type { ApiResp, ListSuccess } from '~/src/types/api'
import { Manga } from '~/src/types/manga'

class PostModule extends FetchFactory<any> {
  async getManga(): Promise<ApiResp<ListSuccess<Manga[]>>> {
    return this.call({
      method: 'GET',
      url: '/manga',
      fetchOptions: {
        query: {
          'includes[]': ['cover_art', 'author'],
          'contentRating[]': ['safe', 'suggestive'],
          'order[followedCount]': 'desc',
          'availableTranslatedLanguage[]': 'pt-br'
        }
      }
    })
  }
}

export default PostModule
