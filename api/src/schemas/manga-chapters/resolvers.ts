import type { GraphQLContext } from '~/src/index'
import { Chapter, RelationshipAttributes } from '~/src/types/manga-chapter'
import { Manga } from '~/src/types/manga'
import { dedupeByBestLanguage, LANG_PRIORITY } from './utils'

// The require-auth plugin (src/index.ts) rejects unauthenticated operations
// before any resolver runs, so `context.modules` is always present here.
function repo(context: GraphQLContext) {
  return context.modules!.manga
}

interface QueryArgs {
  mangaId: string
  chapterId: string
  limit: number
  offset: number
  order: 'asc' | 'desc'
}

interface LatestChaptersArgs {
  limit: number
}

// Id of the manga a chapter belongs to (from its `manga` relationship).
function mangaRelId(chapter: Chapter): string | undefined {
  return chapter.relationships.find((rel) => rel.type === 'manga')?.id
}

export const mangaChaptersResolver = {
  Query: {
    chapters: async (
      parent: unknown,
      args: QueryArgs,
      context: GraphQLContext
    ) => {
      const limit = args.limit ?? 10
      const offset = args.offset ?? 0
      const order = args.order ?? 'desc'

      const [error, resp] = await repo(context).getMangaChapters(
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

    adjacentChapters: async (
      parent: unknown,
      args: QueryArgs,
      context: GraphQLContext
    ) => {
      const [error, resp] = await repo(context).getMangaChapters(
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

    chapterImgs: async (
      parent: unknown,
      args: QueryArgs,
      context: GraphQLContext
    ) => {
      const [error, resp] = await repo(context).getMangaChapterImgs(
        args.chapterId
      )

      if (error) return []

      const data = resp.chapter.data.map(
        (img) => `${resp.baseUrl}/data/${resp.chapter.hash}/${img}`
      )

      return data
    },

    // Global "Latest Updates" feed: one card per chapter (not deduped), each
    // carrying its manga. The chapter's manga relationship has no cover, so we
    // batch-fetch the manga by id (with cover_art) and attach the real node —
    // the Manga.coverUrl field resolver then builds the URL.
    latestChapters: async (
      parent: unknown,
      args: LatestChaptersArgs,
      context: GraphQLContext
    ) => {
      const [error, resp] = await repo(context).getLatestChapters(args.limit)

      if (error) return []

      const chapters = resp.data

      const mangaIds = [
        ...new Set(
          chapters
            .map((chapter) => mangaRelId(chapter))
            .filter((id): id is string => Boolean(id))
        )
      ]

      const [mangaError, mangaResp] =
        await repo(context).getMangasByIds(mangaIds)

      if (mangaError) return []

      const mangaById = new Map<string, Manga>(
        mangaResp.data.map((manga) => [manga.id, manga])
      )

      return chapters.reduce<
        {
          id: string
          chapter: string
          title: string
          translatedLanguage: string
          groupName: string | null
          manga: Manga
        }[]
      >((acc, chapter) => {
        const manga = mangaById.get(mangaRelId(chapter) ?? '')

        if (!manga) return acc

        const group = chapter.relationships.find(
          (rel) => rel.type === 'scanlation_group'
        )

        acc.push({
          id: chapter.id,
          chapter: chapter.attributes.chapter,
          title: chapter.attributes.title,
          translatedLanguage: chapter.attributes.translatedLanguage,
          groupName:
            (group?.attributes as { name?: string } | undefined)?.name ?? null,
          manga
        })

        return acc
      }, [])
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
