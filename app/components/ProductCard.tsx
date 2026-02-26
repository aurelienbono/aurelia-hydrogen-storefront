import { Link } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import type { Product } from '~/graphql/types/storefront.generated';
import { formatPrice } from '~/lib/market';

interface ProductCardProps {
  product: Product;
  currency?: string;
}

export function ProductCard({ product, currency = 'USD' }: ProductCardProps) {
  const variant = product.variants?.nodes?.[0];
  const price = product.priceRange?.minVariantPrice;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;
  const badge = product.metafields?.find((m) => m.key === 'badge')?.value;

  return (
    <Link
      to={`/products/${product.handle}`}
      className="group block"
      prefetch="viewport"
    >
      <div className="relative overflow-hidden aspect-[3/4] bg-neutral-100">
        {product.featuredImage && (
          <Image
            data={product.featuredImage}
            aspectRatio="3/4"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        {badge && (
          <span className="absolute top-3 left-3 px-2 py-0.5 text-xs font-medium bg-black text-white uppercase tracking-wider">
            {badge}
          </span>
        )}
        {variant?.availableForSale === false && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/80 text-sm font-medium">
            Sold Out
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-xs text-neutral-500 uppercase tracking-wider">
          {product.vendor}
        </p>
        <h3 className="mt-0.5 font-medium text-neutral-900 group-hover:underline">
          {product.title}
        </h3>
        <div className="mt-1 flex items-center gap-2">
          {compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price?.amount ?? '0') && (
            <span className="text-sm text-neutral-400 line-through">
              {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
            </span>
          )}
          <span className="font-medium">
            {price && formatPrice(price.amount, price.currencyCode ?? currency)}
          </span>
        </div>
      </div>
    </Link>
  );
}
