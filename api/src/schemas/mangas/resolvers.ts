import type { ApiModules } from '~/src/repository/api'
import type { GraphQLContext } from '~/src/index'
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

type MangaRepo = ApiModules['manga']

// The require-auth plugin (src/index.ts) rejects unauthenticated operations
// before any resolver runs, so `context.modules` is always present here.
function repo(context: GraphQLContext): MangaRepo {
  return context.modules!.manga
}

// Shared helper: fetch a manga list with a given sort order, swallowing errors.
async function fetchMangas(
  manga: MangaRepo,
  order: Record<string, SortOrder>,
  limit = DEFAULT_LIMIT,
  includedTags: string[] = [],
  createdAtSince = ''
) {
  const [error, resp] = await manga.getManga(
    '',
    limit,
    order,
    includedTags,
    createdAtSince
  )

  if (error) return []

  return resp.data
}

export const mangaResolvers = {
  Query: {
    mangas: async (parent: unknown, args: unknown, context: GraphQLContext) =>
      fetchMangas(repo(context), { followedCount: 'desc' }),
    manga: async (
      parent: unknown,
      args: { id: string },
      context: GraphQLContext
    ) => {
      const [error, resp] = await repo(context).getMangaById(args.id)

      if (error) return null

      return resp.data
    },
    mangasByName: async (
      parent: unknown,
      args: MangaArgs,
      context: GraphQLContext
    ) => {
      const [error, resp] = await repo(context).getManga(
        args.mangaName,
        args.limit
      )

      if (error) return []

      return resp.data
    },
    latestUpdates: async (
      parent: unknown,
      args: ListArgs,
      context: GraphQLContext
    ) => fetchMangas(repo(context), { latestUploadedChapter: 'desc' }, args.limit),
    recentlyAdded: async (
      parent: unknown,
      args: ListArgs,
      context: GraphQLContext
    ) => fetchMangas(repo(context), { createdAt: 'desc' }, args.limit),
    mostPopular: async (
      parent: unknown,
      args: ListArgs,
      context: GraphQLContext
    ) => fetchMangas(repo(context), { followedCount: 'desc' }, args.limit),
    highestRanking: async (
      parent: unknown,
      args: ListArgs,
      context: GraphQLContext
    ) => fetchMangas(repo(context), { rating: 'desc' }, args.limit),
    // Recently added (last 30 days) ordered by rating — powers the home banner.
    topRatedRecent: async (
      parent: unknown,
      args: ListArgs,
      context: GraphQLContext
    ) => {
      const createdAtSince = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 19)

      return fetchMangas(
        repo(context),
        { rating: 'desc' },
        args.limit,
        [],
        createdAtSince
      )
    },
    mangasByTag: async (
      parent: unknown,
      args: { includedTags: string[]; limit?: number },
      context: GraphQLContext
    ) =>
      fetchMangas(
        repo(context),
        { followedCount: 'desc' },
        args.limit,
        args.includedTags
      ),
    categories: async (
      parent: unknown,
      args: unknown,
      context: GraphQLContext
    ) => {
      const [error, resp] = await repo(context).getTags()

      if (error) return []

      return resp.data
    },
    // Flexible Explore query: combines an optional title, multiple sort criteria
    // (order[<field>]=asc|desc) and included tag ids in a single call. Reuses
    // getManga, which already supports all four inputs.
    exploreMangas: async (
      parent: unknown,
      args: ExploreArgs,
      context: GraphQLContext
    ) => {
      const order = (args.order ?? []).reduce<Record<string, SortOrder>>(
        (acc, o) => ({ ...acc, [o.field]: o.direction ?? 'desc' }),
        {}
      )

      const finalOrder = Object.keys(order).length
        ? order
        : { followedCount: 'desc' as SortOrder }

      const [error, resp] = await repo(context).getManga(
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
