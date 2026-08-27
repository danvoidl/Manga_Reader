import { ApolloServer, type ApolloServerPlugin } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { GraphQLError } from 'graphql'
import { schema } from './schemas'
import { createModules, type ApiModules } from './repository/api'

// Per-request GraphQL context. The token is the caller's MangaDex access token
// (forwarded by the reader-app); `modules` is an HTTP client bound to it, so
// every upstream call runs under that user's identity.
export interface GraphQLContext {
  token: string | null
  modules: ApiModules | null
}

// Pull the bearer token out of the incoming Authorization header.
function bearerFrom(header?: string): string | null {
  if (!header) return null
  const [scheme, value] = header.split(' ')
  if (scheme?.toLowerCase() !== 'bearer' || !value) return null
  return value
}

// Require an authenticated caller for every real operation. Introspection is
// left open so the reader-app's GraphQL codegen can read the schema over HTTP
// without a token.
const requireAuth: ApolloServerPlugin<GraphQLContext> = {
  async requestDidStart() {
    return {
      async didResolveOperation({ request, contextValue }) {
        if (request.operationName === 'IntrospectionQuery') return
        if (!contextValue.token) {
          throw new GraphQLError('Não autenticado', {
            extensions: { code: 'UNAUTHENTICATED', http: { status: 401 } }
          })
        }
      }
    }
  }
}

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

console.log(`🚀  Server ready at: ${url}`)
