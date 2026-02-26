export type Storefront = {
  query: (query: string, options?: { variables?: Record<string, unknown> }) => Promise<unknown>;
  mutate: (mutation: string, options?: { variables?: Record<string, unknown> }) => Promise<unknown>;
};

export function getStorefront(context: { storefront?: Storefront }) {
  if (!context.storefront) {
    throw new Error('Storefront client not available');
  }
  return context.storefront;
}
