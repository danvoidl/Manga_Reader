import { ofetch, FetchError } from "ofetch";

// Client-side OAuth against MangaDex's auth service. The credentials and the
// resulting tokens NEVER leave the device / never touch the app's own backend:
// this talks straight to auth.mangadex.org.
//
// Docs: https://api.mangadex.org/docs/02-authentication/personal-clients/
export const AUTH_URL =
  process.env.EXPO_PUBLIC_MANGADEX_AUTH_URL ?? "https://auth.mangadex.org";

// Keycloak (OpenID Connect) token endpoint for MangaDex's realm.
const TOKEN_ENDPOINT = `${AUTH_URL}/realms/mangadex/protocol/openid-connect/token`;

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
}

export interface LoginParams {
  username: string;
  password: string;
  clientId: string;
  clientSecret: string;
}

export interface RefreshParams {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

async function requestToken(form: URLSearchParams): Promise<AuthTokens> {
  let data: Partial<AuthTokens>;

  try {
    // ofetch parses JSON, throws on non-2xx and sets the urlencoded
    // Content-Type from the URLSearchParams body automatically.
    data = await ofetch<AuthTokens>(TOKEN_ENDPOINT, {
      method: "POST",
      body: form,
      retry: 0,
    });
  } catch (err) {
    // Never surface the raw body (it may echo request params). Map to friendly text.
    if (err instanceof FetchError && err.status) {
      if (err.status === 400 || err.status === 401) {
        throw new Error(
          "Credenciais inválidas. Confira usuário, senha, client id e secret.",
        );
      }
      throw new Error(`Falha na autenticação (HTTP ${err.status}).`);
    }
    throw new Error(
      "Não foi possível conectar à MangaDex. Verifique sua conexão.",
    );
  }

  if (!data.access_token || !data.refresh_token) {
    throw new Error("Resposta de autenticação inesperada.");
  }

  return data as AuthTokens;
}

export function login({
  username,
  password,
  clientId,
  clientSecret,
}: LoginParams): Promise<AuthTokens> {
  const form = new URLSearchParams();
  form.set("grant_type", "password");
  form.set("username", username);
  form.set("password", password);
  form.set("client_id", clientId);
  form.set("client_secret", clientSecret);

  return requestToken(form);
}

export function refresh({
  clientId,
  clientSecret,
  refreshToken,
}: RefreshParams): Promise<AuthTokens> {
  const form = new URLSearchParams();
  form.set("grant_type", "refresh_token");
  form.set("refresh_token", refreshToken);
  form.set("client_id", clientId);
  form.set("client_secret", clientSecret);

  return requestToken(form);
}
