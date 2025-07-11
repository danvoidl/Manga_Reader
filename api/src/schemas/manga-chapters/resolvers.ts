import modules from '~/src/repository/api'
import { RelationshipAttributes } from '~/src/types/manga-chapter'
import { config } from '~/src/config'

interface QueryArgs {
  mangaId: string
  chapterId: string
}

export const mangaChaptersResolver = {
  Query: {
    chapters: async (parent: unknown, args: QueryArgs) => {
      const [error, resp] = await modules.manga.getMangaChapters(args.mangaId)

      if (error) return []

      return resp.data
    },
    
    chapterImgs: async (parent: unknown, args: QueryArgs) => {
      const [error, resp] = await modules.manga.getMangaChapterImgs(
        args.chapterId
      )

      if (error) return []

      const data = resp.chapter.data.map(
        (img) => `${resp.baseUrl}/data/${resp.chapter.hash}/${img}`
      )

      return data
    }
  },

  RelationshipAttributes: {
    __resolveType(obj: RelationshipAttributes) {
      if ('name' in obj) return 'ScanlationGroupAttributes'
      if ('username' in obj) return 'UserAttributes'

      return obj
    }
  }
}
