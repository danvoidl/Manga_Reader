# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This is a two-package monorepo (no workspace tooling — each package is installed and run independently):

- `reader-app/` — Expo / React Native manga reader (the client). Uses **bun** (`bun.lock`).
- `api/` — Apollo GraphQL server that proxies the **MangaDex** REST API. Uses **npm** (`package-lock.json`). The GraphQL layer is a thin wrapper over MangaDex; consult the upstream API docs when adding/changing endpoints, query params, or types: https://api.mangadex.org/docs/

The home screen (`reader-app/src/app/index.tsx`) now consumes the `api` GraphQL server (see "reader-app data layer" below). Other screens (the chapter reader, manga detail) still render from local seed data in `src/seed/` — migrating those to the API is ongoing work, not a bug.

## Commands

### reader-app (run from `reader-app/`)
- `bun install` — install deps
- `bun start` / `bun android` / `bun ios` / `bun web` — start Expo dev server (uses `expo-dev-client`, so a custom dev build is expected rather than Expo Go)
- `bun run lint` — ESLint (`eslint-config-expo` + Prettier)
- No test runner is configured.
- Builds are via EAS (`eas.json` defines `development`, `preview`, `production` profiles); `appVersionSource` is `remote`.

### api (run from `api/`)
- `npm install`
- `npm run dev` — hot-reloading dev server via `tsx watch` (serves on `http://localhost:4000`)
- `npm run compile` — type-check + emit to `dist/`
- `npm start` — compile then run `dist/index.js`
- No tests (the `test` script intentionally exits 1).

## api architecture

Apollo standalone server (`src/index.ts`) on port 4000. GraphQL is assembled in `src/schemas/index.ts` from per-domain folders (`mangas/`, `manga-chapters/`), each exporting `typeDefs` + `resolvers` that are merged with `makeExecutableSchema`.

Data access uses a **repository + factory pattern**:
- `src/repository/factory.ts` — `FetchFactory<T>` wraps `ofetch` and returns a Go-style tuple `[error]` / `[null, data]` from `.call()`. Never throws; resolvers destructure `[error, resp]` and return `[]`/empty on error.
- `src/repository/modules/*.module.ts` — one class per domain extending `FetchFactory`. Modules encapsulate MangaDex query params (e.g. `manga.module.ts` hardcodes `availableTranslatedLanguage=pt-br`, content rating, and cover/author includes).
- `src/repository/api.ts` — builds the shared `ofetch` instance and instantiates all modules (`modules.auth`, `modules.manga`). An `onRequest` hook injects `Authorization: Bearer <token>` from the cache for every request except `/auth/login`.

Auth against MangaDex lives in `src/cache/index.ts`: `myCache` (a `node-cache` instance) stores `AUTH_TOKEN` / `REFRESH_TOKEN` with the TTLs MangaDex returns; `authenticate()` refreshes or logs in. Note: nothing calls `authenticate()` on startup yet, so token population is not wired into the server boot path.

Config comes from env vars via `dotenv` in `src/config.ts` (`.env` is gitignored). Required keys: `BASE_URL`, `AUTH_BASE_URL`, `UPLOAD_BASE_URL`, `MD_USERNAME`, `MD_PASSWORD`, `CLIENT_ID`, `CLIENT_SECRET`, `GRANT_TYPE`.

Path alias: `~/*` → repo root (e.g. `~/src/types/...`). ESM (`"type": "module"`).

## reader-app architecture

Expo Router (file-based routing under `src/app/`); `expo-router/entry` is the app entry. `src/app/_layout.tsx` is the root Stack (headers hidden, dark `#262626` background, wrapped in `GestureHandlerRootView`). Routes:
- `index.tsx` — home
- `manga-page.tsx` — manga detail
- `manga-chapter/(chapter)/[id].tsx` — the chapter reader

Styling is **NativeWind v4** (Tailwind classes via `className`). `global.css` is the Tailwind entry (wired through `metro.config.js` `withNativeWind` and the `babel.config.js` `jsxImportSource: nativewind` preset). `src/utils/cn.ts` merges classes with `clsx` + `tailwind-merge`. The app is dark-mode only (`userInterfaceStyle: "dark"`).

The chapter reader is state-driven through React Context providers under `src/store/`, composed in the reader route:
- `ChapterControlContext` — tracks `currentPage`/`totalPages` and drives the page `FlatList` via `chapterListRef.scrollToIndex` (`handleSlide`). Currently reads page count from `src/seed/chapters`.
- `SystemBarsContext` — status/navigation bar visibility while reading.

Components are grouped by feature (`components/manga-chapter/`, `components/manga-page/`, `components/manga/`) plus shared primitives (`AppText`, `Chip`, `Board`, zoom via `@likashefqet/react-native-image-zoom`). Animations use `react-native-reanimated` v4 (with `react-native-worklets`); images use `expo-image` (see the shared `blurhash` in `src/constants/general.ts`).

Path alias: `@/*` → `src/*` (`tsconfig.json`).

### reader-app data layer (GraphQL)

The home screen fetches from the `api` GraphQL server through a small hand-rolled layer (no Apollo Client / heavy dep):
- `src/services/graphql.ts` — `gqlRequest(query, variables)` POSTs to `API_URL` (the Apollo standalone server's root path). Base URL comes from `EXPO_PUBLIC_API_URL`, defaulting to `http://localhost:4000`. **Host caveat:** localhost only works on iOS simulator / web; Android emulator needs `http://10.0.2.2:4000`, a physical device needs the machine's LAN IP. Set it via `EXPO_PUBLIC_API_URL` (e.g. in `.env`).
- `src/services/manga.ts` — the list queries (`latestUpdates` / `recentlyAdded` / `highestRanking`), each **aliased to `mangas`** so the hook always reads `data.mangas`. Also maps `GqlManga` → the UI's `MangaCover`: builds the cover URL as `https://uploads.mangadex.org/covers/{id}/{fileName}.256.jpg` (fileName comes from the cover_art relationship), and resolves a display title with a fallback chain (`title.en/pt_br/ja` → `altTitles` en/pt_br → any value → `"Sem título"`), since MangaDex frequently stores the canonical title only in a romanized original language.
- `src/hooks/useMangas.ts` — `useMangas(query, limit)` returns `{ data, loading, error }` with an `active` guard against setState-after-unmount.
- `src/components/home/*` — `MangaSection` is the reusable presentational section (title + horizontal carousel, with loading/error states); `LatestUpdates` / `RecentlyAdded` / `HighestRanking` each bind one query to it.

The three sections map to distinct MangaDex sort orders defined server-side in `api/src/schemas/mangas/resolvers.ts` (`latestUploadedChapter` / `createdAt` / `followedCount`, all `desc`).

### reader-app authentication (client-side, device-only)

Login is **fully client-side and bypasses the `api` server on purpose** — each user authenticates with their own MangaDex *personal API client*, and the secret must never reach the app owner. Do not route these credentials/tokens through `api/`.
- `src/services/auth.ts` — OAuth password/refresh grants POSTed **directly** to `auth.mangadex.org` (`EXPO_PUBLIC_MANGADEX_AUTH_URL`, default `https://auth.mangadex.org`). Requires `username`, `password`, `client_id` **and** `client_secret`. Error messages are deliberately generic — never log or surface secrets/tokens.
- `src/services/secureStore.ts` — persists the session JSON (client id/secret + tokens, **never the password**) in the device secure enclave via `expo-secure-store`. Native-only: SecureStore is unavailable on web.
- `src/store/AuthContext.tsx` — `useAuth()` (`login` / `logout` / `getValidAccessToken` / `isAuthenticated`). Restores the session on startup, auto-refreshes the 15-min access token (coalescing concurrent refreshes), and clears the session if the refresh token is dead. `getValidAccessToken()` is ready for future authenticated calls, which must go **direct to MangaDex**, not via `api/`. Provider is mounted in `src/app/_layout.tsx`.
- Screens: `src/app/login.tsx` (form) + `src/app/login-help.tsx` (how to obtain the client id/secret + privacy notice). Login is **optional** — reached via `src/components/home/AccountButton.tsx`; there is no auth gate.
- Reusable form primitives live in `src/components/ui/` (`Input`, `Button`) — the app had none before.

## Conventions

- Some user-facing strings and error messages are in **Portuguese** (pt-BR) — the reader targets a Brazilian Portuguese audience; match the existing language of surrounding code.
- Both packages are strict TypeScript.
