import type { CodegenConfig } from "@graphql-codegen/cli";

// The codegen CLI does not load `.env` on its own, so pull it in here (Node's
// built-in loader — no dependency). Ignored if the file is absent (e.g. CI,
// where the vars come from the real environment).
try {
  process.loadEnvFile();
} catch {
  // no .env file — rely on the ambient environment
}

// Generates typed GraphQL documents into src/gql/. Run with `bun run codegen`
// — it introspects the schema over HTTP.
//
// Schema source resolution order:
//   1. CODEGEN_SCHEMA_URL — explicit override, just for codegen
//   2. EXPO_PUBLIC_API_URL — same remote the app talks to (single source of truth)
//   3. http://localhost:4000 — the local Apollo dev server
const config: CodegenConfig = {
  schema:
    process.env.CODEGEN_SCHEMA_URL ??
    process.env.EXPO_PUBLIC_API_URL ??
    "http://localhost:4000",
  documents: ["src/**/*.{ts,tsx}"],
  // No graphql() calls yet in a file is fine — don't fail the run.
  ignoreNoDocuments: true,
  generates: {
    "./src/gql/": {
      preset: "client",
      // We consume documents through a custom fetch (services/graphql.ts), so
      // skip fragment masking — it only adds indirection for Apollo/urql.
      // NOTE: fragmentMasking is a *preset* option (presetConfig), not a plugin
      // config option; putting it under `config` is silently ignored.
      presetConfig: {
        fragmentMasking: false,
      },
    },
  },
};

export default config;
