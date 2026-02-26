import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
  build: {
    target: 'esnext',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('@shopify')) return 'shopify';
            if (id.includes('react')) return 'react-vendor';
          }
        },
      },
    },
  },
  ssr: {
    optimizeDeps: {
      include: ['@shopify/hydrogen'],
    },
    noExternal: ['@shopify/hydrogen'],
  },
});
