import modules from '~/src/repository/api'
import { Manga } from '~/src/types/manga'

export const resolvers = {
  Query: {
    mangas: async () => {
      const [error, resp] = await modules.manga.getManga()

      if (error) return []

      console.log('MANGA RESOLVER', error, resp.data[0].attributes)

      return resp.data
    },
  },
  Manga: {
    relationships: (parent: Manga) => {
      return parent.relationships.filter(
        (rel) => rel.attributes && rel.attributes.fileName
      )
    }
  }
}
