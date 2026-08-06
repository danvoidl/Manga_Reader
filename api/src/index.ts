import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { schema } from './schemas'

const server = new ApolloServer({
  schema
})

const { url } = await startStandaloneServer(server, {
  listen: { port: Number(process.env.PORT) || 4000 }
})

console.log(`🚀  Server ready at: ${url}`)
