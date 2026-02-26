import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://shopify.dev/storefront-api/2024-01/graphql.json',
  documents: ['app/**/*.{ts,tsx}', '!app/graphql/types/**'],
  generates: {
    'app/graphql/types/storefront.generated.ts': {
      plugins: ['typescript', 'typescript-operations'],
      config: {
        skipTypename: true,
        enumsAsConst: true,
        futureProofEnums: true,
        preResolveTypes: true,
        avoidOptionals: true,
      },
    },
  },
};

export default config;
