import modules from '~/src/repository/api'
import { Manga } from '~/src/types/manga'
import { config } from '~/src/config'

interface MangaArgs {
  mangaName: string
  limit: number
}

interface CoverUrlArgs {
  size: number
}

interface ListArgs {
  limit?: number
}

interface OrderInput {
  field: string
  direction?: SortOrder
}

interface ExploreArgs {
  title?: string
  order?: OrderInput[]
  includedTags?: string[]
  limit?: number
}

type SortOrder = 'asc' | 'desc'

const DEFAULT_LIMIT = 96

// Shared helper: fetch a manga list with a given sort order, swallowing errors.
async function fetchMangas(
  order: Record<string, SortOrder>,
  limit = DEFAULT_LIMIT,
  includedTags: string[] = []
) {
  const [error, resp] = await modules.manga.getManga(
    '',
    limit,
    order,
    includedTags
  )

  if (error) return []

  return resp.data
}

export const mangaResolvers = {
  Query: {
    mangas: async () => fetchMangas({ followedCount: 'desc' }),
    manga: async (parent: unknown, args: { id: string }) => {
      const [error, resp] = await modules.manga.getMangaById(args.id)

      if (error) return null

      return resp.data
    },
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
    mostPopular: async (parent: unknown, args: ListArgs) =>
      fetchMangas({ followedCount: 'desc' }, args.limit),
    highestRanking: async (parent: unknown, args: ListArgs) =>
      fetchMangas({ rating: 'desc' }, args.limit),
    mangasByTag: async (
      parent: unknown,
      args: { includedTags: string[]; limit?: number }
    ) => fetchMangas({ followedCount: 'desc' }, args.limit, args.includedTags),
    categories: async () => {
      const [error, resp] = await modules.manga.getTags()

      if (error) return []

      return resp.data
    },
    // Flexible Explore query: combines an optional title, multiple sort criteria
    // (order[<field>]=asc|desc) and included tag ids in a single call. Reuses
    // getManga, which already supports all four inputs.
    exploreMangas: async (parent: unknown, args: ExploreArgs) => {
      const order = (args.order ?? []).reduce<Record<string, SortOrder>>(
        (acc, o) => ({ ...acc, [o.field]: o.direction ?? 'desc' }),
        {}
      )

      const finalOrder = Object.keys(order).length
        ? order
        : { followedCount: 'desc' as SortOrder }

      const [error, resp] = await modules.manga.getManga(
        args.title ?? '',
        args.limit,
        finalOrder,
        args.includedTags ?? []
      )

      if (error) return []

      return resp.data
    }
  },
  Manga: {
    relationships: (parent: Manga) => {
      return parent.relationships.filter(
        (rel) => rel.attributes && rel.attributes.fileName
      )
    },
    // Build the cover URL server-side from the cover_art relationship so the
    // client never has to assemble it. `size` picks the thumbnail variant
    // (e.g. 256/512); 0 returns the original.
    coverUrl: (parent: Manga, args: CoverUrlArgs) => {
      const cover = parent.relationships.find(
        (rel) => rel.type === 'cover_art' && rel.attributes?.fileName
      )

      if (!cover) return null

      const { size } = args
      const suffix = size && size > 0 ? `.${size}.jpg` : ''

      return `${config.UPLOAD_BASE_URL}/covers/${parent.id}/${cover.attributes.fileName}${suffix}`
    }
  }
}
