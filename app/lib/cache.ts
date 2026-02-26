import {
  CacheShort,
  CacheLong,
  CacheCustom,
  type AllCacheOptions,
} from '@shopify/hydrogen';

/**
 * Stale-while-revalidate cache strategy
 * Serves stale content while revalidating in background
 */
export const staleWhileRevalidate = (override?: Partial<AllCacheOptions>) =>
  CacheCustom({
    mode: 'public',
    maxAge: 60,
    staleWhileRevalidate: 900,
    staleIfError: 86400,
    ...override,
  });

/**
 * Product pages - moderate cache
 */
export const productCache = () =>
  staleWhileRevalidate({ maxAge: 60, staleWhileRevalidate: 3600 });

/**
 * Collection pages - longer cache
 */
export const collectionCache = () =>
  staleWhileRevalidate({ maxAge: 300, staleWhileRevalidate: 7200 });

/**
 * Static content (metaobjects, CMS) - long cache
 */
export const staticCache = () => CacheLong();

/**
 * No cache for dynamic content (cart, auth)
 */
export const noCache = () => CacheShort({ maxAge: 0 });
