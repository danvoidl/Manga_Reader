import { print } from 'graphql'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'

// Base URL of the GraphQL API (Apollo standalone server, served at the root path).
// Override per environment with EXPO_PUBLIC_API_URL, e.g.:
//   - iOS simulator / web:   http://localhost:4000
//   - Android emulator:      http://10.0.2.2:4000
//   - Physical device:       http://<your-machine-LAN-IP>:4000
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000'

interface GraphQLResponse<T> {
  data?: T
  errors?: { message: string }[]
}

export async function gqlRequest<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables
): Promise<TResult> {
  // A typed document is an AST node — serialize it back to a query string.
  const query = typeof document === 'string' ? document : print(document)

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables })
  })

  if (!res.ok) {
    throw new Error(`GraphQL request failed: HTTP ${res.status}`)
  }

  const json = (await res.json()) as GraphQLResponse<TResult>

  if (json.errors?.length) {
    throw new Error(json.errors[0].message)
  }

  if (!json.data) {
    throw new Error('GraphQL response contained no data')
  }

  return json.data
}
