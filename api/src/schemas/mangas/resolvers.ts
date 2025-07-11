import modules from '~/src/repository/api'
import { Manga } from '~/src/types/manga'

interface MangaArgs {
  mangaName: string
  limit: number
}

export const mangaResolvers = {
  Query: {
    mangas: async () => {
      const [error, resp] = await modules.manga.getManga()

      if (error) return []

      console.log('MANGA RESOLVER', error, resp.data[0].attributes)

      return resp.data
    },
    mangasByName: async (parent: unknown, args: MangaArgs) => {
      const [error, resp] = await modules.manga.getManga(
        args.mangaName,
        args.limit
      )

      if (error) return []

      console.log('MANGA BY NAME RESOLVER', error, resp.data[0].attributes)

      return resp.data
    }
  },
  Manga: {
    relationships: (parent: Manga) => {
      return parent.relationships.filter(
        (rel) => rel.attributes && rel.attributes.fileName
      )
    }
  }
}
