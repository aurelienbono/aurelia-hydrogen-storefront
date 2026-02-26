import type { Product, Collection } from '~/graphql/types/storefront.generated';

export interface JsonLdProduct {
  '@context': string;
  '@type': string;
  name: string;
  description?: string;
  image?: string[];
  sku?: string;
  offers: {
    '@type': string;
    price: string;
    priceCurrency: string;
    availability: string;
    url: string;
  };
}

export interface JsonLdCollection {
  '@context': string;
  '@type': string;
  name: string;
  description?: string;
  url: string;
  numberOfItems?: number;
}

export function productJsonLd(
  product: Product,
  url: string,
  variants?: { id: string; price: { amount: string; currencyCode: string }; availableForSale?: boolean }[],
): JsonLdProduct | { '@context': string; '@type': string; name: string; description?: string; image?: string[]; offers: object } | null {
  if (!product) return null;

  const variantList = variants ?? product.variants?.nodes ?? [];
  const prices = variantList
    .map((v) => parseFloat(v?.price?.amount ?? '0'))
    .filter((p) => p > 0);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;
  const currency = variantList[0]?.price?.currencyCode ?? product.priceRange?.minVariantPrice?.currencyCode ?? 'USD';
  const image = product.featuredImage?.url ?? product.images?.nodes?.[0]?.url;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description ?? undefined,
    image: image ? [image] : undefined,
    offers:
      variantList.length > 1
        ? {
            '@type': 'AggregateOffer',
            priceCurrency: currency,
            lowPrice: minPrice,
            highPrice: maxPrice,
            offerCount: variantList.length,
            availability: variantList.some((v) => v?.availableForSale)
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            url,
          }
        : {
            '@type': 'Offer',
            price: minPrice || '0',
            priceCurrency: currency,
            availability: variantList[0]?.availableForSale
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            url,
          },
  };
}

export function collectionJsonLd(
  collection: Collection,
  url: string,
): JsonLdCollection | null {
  if (!collection) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.title,
    description: collection.description ?? undefined,
    url,
    numberOfItems: collection.products?.nodes?.length,
  };
}

export function organizationJsonLd(siteName: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url,
  };
}
