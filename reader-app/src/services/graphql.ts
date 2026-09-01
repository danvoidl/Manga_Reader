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

// The API now runs every request under the caller's own MangaDex identity, so
// each GraphQL call must carry the logged-in user's access token. `gqlRequest`
// is a plain function outside React, so AuthProvider registers a getter here on
// mount (see AuthContext) — the getter refreshes the token when it's near expiry.
type TokenGetter = () => Promise<string | null>

let tokenGetter: TokenGetter | null = null

export function setAuthTokenGetter(getter: TokenGetter | null) {
  tokenGetter = getter
}

export async function gqlRequest<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables
): Promise<TResult> {
  // A typed document is an AST node — serialize it back to a query string.
  const query = typeof document === 'string' ? document : print(document)

  const token = tokenGetter ? await tokenGetter() : null

  // The gate keeps data screens behind login, so a token is normally present.
  // If it isn't (session expired mid-flight), fail fast — the auth guard will
  // send the user back to the login screen.
  if (!token) {
    throw new Error('Sessão expirada. Entre novamente.')
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
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
