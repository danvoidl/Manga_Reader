import modules from '~/src/repository/api'
import { RelationshipAttributes } from '~/src/types/manga-chapter'
import { dedupeByBestLanguage, LANG_PRIORITY } from './utils'

interface QueryArgs {
  mangaId: string
  chapterId: string
  limit: number
  offset: number
  order: 'asc' | 'desc'
}

export const mangaChaptersResolver = {
  Query: {
    chapters: async (parent: unknown, args: QueryArgs) => {
      const limit = args.limit ?? 10
      const offset = args.offset ?? 0
      const order = args.order ?? 'desc'

      const [error, resp] = await modules.manga.getMangaChapters(
        args.mangaId,
        LANG_PRIORITY
      )

      if (error) return { items: [], total: 0, limit, offset }

      // dedupeByBestLanguage returns the list descending (latest first);
      // reverse it for ascending (first chapter to latest) before slicing.
      const deduped = dedupeByBestLanguage(resp.data)
      const ordered = order === 'asc' ? [...deduped].reverse() : deduped

      return {
        items: ordered.slice(offset, offset + limit),
        total: deduped.length,
        limit,
        offset
      }
    },

    adjacentChapters: async (parent: unknown, args: QueryArgs) => {
      const [error, resp] = await modules.manga.getMangaChapters(
        args.mangaId,
        LANG_PRIORITY
      )

      if (error) return { next: null, prev: null }

      // Deduped list is sorted by chapter number descending (latest first),
      // so the next chapter to read sits at a lower index.
      const deduped = dedupeByBestLanguage(resp.data)
      const i = deduped.findIndex((chapter) => chapter.id === args.chapterId)

      if (i === -1) return { next: null, prev: null }

      return {
        next: deduped[i - 1] ?? null,
        prev: deduped[i + 1] ?? null
      }
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
