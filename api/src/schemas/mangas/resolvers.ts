import modules from '~/src/repository/api'
import { Manga } from '~/src/types/manga'

interface MangaArgs {
  mangaName: string
  limit: number
}

interface ListArgs {
  limit?: number
}

type SortOrder = 'asc' | 'desc'

const DEFAULT_LIMIT = 96

// Shared helper: fetch a manga list with a given sort order, swallowing errors.
async function fetchMangas(
  order: Record<string, SortOrder>,
  limit = DEFAULT_LIMIT
) {
  const [error, resp] = await modules.manga.getManga('', limit, order)

  if (error) return []

  return resp.data
}

export const mangaResolvers = {
  Query: {
    mangas: async () => fetchMangas({ followedCount: 'desc' }),
    mangasByName: async (parent: unknown, args: MangaArgs) => {
      const [error, resp] = await modules.manga.getManga(
        args.mangaName,
        args.limit
      )

      if (error) return []

      return resp.data
    },
    latestUpdates: async (parent: unknown, args: ListArgs) =>
      fetchMangas({ latestUploadedChapter: 'desc' }, args.limit),
    recentlyAdded: async (parent: unknown, args: ListArgs) =>
      fetchMangas({ createdAt: 'desc' }, args.limit),
    highestRanking: async (parent: unknown, args: ListArgs) =>
      fetchMangas({ followedCount: 'desc' }, args.limit)
  },
  Manga: {
    relationships: (parent: Manga) => {
      return parent.relationships.filter(
        (rel) => rel.attributes && rel.attributes.fileName
      )
    }
  }
}
