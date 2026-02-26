import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import { VariantSelector } from './VariantSelector';
import type { Product, ProductVariant } from '~/graphql/types/storefront.generated';
import { formatPrice } from '~/lib/market';

interface ProductFormProps {
  product: Product;
  variants: ProductVariant[];
  currency?: string;
  onAddToCart?: (variantId: string, quantity: number) => void;
}

function getInitialOptionsFromUrl(
  searchParams: URLSearchParams,
  options: Product['options'],
): Record<string, string> {
  const initial: Record<string, string> = {};
  options?.forEach((opt) => {
    const paramValue = searchParams.get(opt.name);
    if (paramValue && opt.values.includes(paramValue)) {
      initial[opt.name] = paramValue;
    } else {
      initial[opt.name] = opt.values[0] ?? '';
    }
  });
  return initial;
}

export function ProductForm({
  product,
  variants,
  currency = 'USD',
  onAddToCart,
}: ProductFormProps) {
  const [searchParams] = useSearchParams();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    () => getInitialOptionsFromUrl(searchParams, product.options),
  );
  const [quantity, setQuantity] = useState(1);

  // Sync from URL when navigating (back/forward, direct link with variant in URL)
  useEffect(() => {
    const fromUrl = getInitialOptionsFromUrl(searchParams, product.options);
    setSelectedOptions((prev) => {
      const changed = Object.keys(fromUrl).some((k) => prev[k] !== fromUrl[k]);
      return changed ? fromUrl : prev;
    });
  }, [searchParams.toString()]);
  const [isAdding, setIsAdding] = useState(false);

  const selectedVariant =
    variants.find((v) =>
      v.selectedOptions?.every(
        (opt) => selectedOptions[opt.name] === opt.value,
      ),
    ) ?? variants[0];

  const handleOptionChange = useCallback((optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
  }, []);

  const handleAddToCart = () => {
    if (!selectedVariant?.id || !onAddToCart) return;
    setIsAdding(true);
    onAddToCart(selectedVariant.id, quantity);
    // Clear loading state after brief delay (optimistic UI updates immediately)
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="space-y-6">
      <VariantSelector
        options={product.options ?? []}
        variants={variants}
        selectedOptions={selectedOptions}
        onOptionChange={handleOptionChange}
        syncWithUrl
      />

      <div>
        <label className="block text-sm font-medium mb-2">Quantity</label>
        <select
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border border-neutral-300 px-3 py-2 min-w-[80px]"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {selectedVariant?.image && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-500">Variant image:</span>
          <Image
            data={selectedVariant.image}
            width={64}
            height={64}
            className="object-cover border"
          />
        </div>
      )}

      <div className="flex items-center gap-4">
        <span className="text-xl font-semibold">
          {selectedVariant?.price &&
            formatPrice(
              selectedVariant.price.amount,
              selectedVariant.price.currencyCode ?? currency,
            )}
        </span>
        {selectedVariant?.compareAtPrice &&
          parseFloat(selectedVariant.compareAtPrice.amount) >
            parseFloat(selectedVariant.price?.amount ?? '0') && (
            <span className="text-neutral-500 line-through">
              {formatPrice(
                selectedVariant.compareAtPrice.amount,
                selectedVariant.compareAtPrice.currencyCode ?? currency,
              )}
            </span>
          )}
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={
          !selectedVariant?.availableForSale || isAdding || !onAddToCart
        }
        className="w-full py-3 px-6 bg-black text-white font-medium hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {!selectedVariant?.availableForSale
          ? 'Sold Out'
          : isAdding
            ? 'Adding...'
            : 'Add to Cart'}
      </button>
    </div>
  );
}
