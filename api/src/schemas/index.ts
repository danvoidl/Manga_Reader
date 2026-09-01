import { makeExecutableSchema } from '@graphql-tools/schema'

import { mangaTypeDefs } from './mangas/schema'
import { mangaResolvers } from './mangas/resolvers'

import { mangaChaptersResolver } from './manga-chapters/resolvers'
import { mangaChaptersTypeDefs } from './manga-chapters/schema'

export const schema = makeExecutableSchema({
  typeDefs: [mangaTypeDefs, mangaChaptersTypeDefs],
  resolvers: [mangaResolvers, mangaChaptersResolver]
})
