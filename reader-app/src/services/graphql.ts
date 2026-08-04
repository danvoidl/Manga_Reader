// Base URL of the GraphQL API (Apollo standalone server, served at the root path).
// Override per environment with EXPO_PUBLIC_API_URL, e.g.:
//   - iOS simulator / web:   http://localhost:4000
//   - Android emulator:      http://10.0.2.2:4000
//   - Physical device:       http://<your-machine-LAN-IP>:4000
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000";

interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

export async function gqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`GraphQL request failed: HTTP ${res.status}`);
  }

  const json = (await res.json()) as GraphQLResponse<T>;

  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }

  if (!json.data) {
    throw new Error("GraphQL response contained no data");
  }

  return json.data;
}
