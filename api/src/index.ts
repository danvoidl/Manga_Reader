import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { schema } from './schemas'
import { createModules } from './repository/api'
import { requireAuth, GraphQLContext, bearerFrom } from './middleware/auth'


const server = new ApolloServer<GraphQLContext>({
  schema,
  // Apollo disables introspection when NODE_ENV=production. We keep it on so
  // the reader-app's GraphQL codegen can introspect the deployed schema over
  // HTTP. Low risk here: the server is a read-only proxy over the public
  // MangaDex API and exposes no privileged operations.
  introspection: true,
  plugins: [requireAuth]
})

const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => {
    const token = bearerFrom(req.headers.authorization)
    return { token, modules: token ? createModules(token) : null }
  },
  listen: { port: Number(process.env.PORT) || 4000 }
})

console.log(`🚀 Server ready at: ${url}`)
