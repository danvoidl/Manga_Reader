import type { CodegenConfig } from "@graphql-codegen/cli";

// Generates typed GraphQL documents into src/gql/. Run with `bun run codegen`
// while the api/ dev server is up (it introspects the schema over HTTP).
//
// Schema source: the local Apollo server. Override with CODEGEN_SCHEMA_URL if
// your API runs elsewhere.
const config: CodegenConfig = {
  schema: process.env.CODEGEN_SCHEMA_URL ?? "http://localhost:4000",
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
