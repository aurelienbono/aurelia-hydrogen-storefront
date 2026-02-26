import { defineConfig } from '@shopify/cli';

export default defineConfig({
  app: {
    name: 'premium-fashion-store',
    build: {
      automaticallyUpdateRoutes: true,
    },
  },
  buildCommand: 'npm run build',
  hydrogen: {
    storefront: {
      defaultLocale: 'en',
      storeDomain: 'hydrogen-preview.myshopify.com',
      storefrontId: import.meta.env?.SHOPIFY_STOREFRONT_ID ?? '',
    },
  },
});
