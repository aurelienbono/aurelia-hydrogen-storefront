import { useCallback } from 'react';
import { useNavigate, useSearchParams } from '@remix-run/react';
import type { ProductOption, ProductVariant } from '~/graphql/types/storefront.generated';

interface VariantSelectorProps {
  options: ProductOption[];
  variants: ProductVariant[];
  selectedOptions: Record<string, string>;
  onOptionChange: (optionName: string, value: string) => void;
  /** Sync selection changes to URL (shareable links, back/forward) */
  syncWithUrl?: boolean;
}

/**
 * VariantSelector - Syncs variant selection with URL search params.
 * Enables shareable links and proper back/forward navigation.
 */
export function VariantSelector({
  options,
  variants,
  selectedOptions,
  onOptionChange,
  syncWithUrl = true,
}: VariantSelectorProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleChange = useCallback(
    (optionName: string, value: string) => {
      onOptionChange(optionName, value);

      if (syncWithUrl) {
        const newParams = new URLSearchParams(searchParams);
        newParams.set(optionName, value);
        navigate(`?${newParams.toString()}`, { replace: true });
      }
    },
    [onOptionChange, navigate, searchParams, syncWithUrl],
  );

  const selectedVariant =
    variants.find((v) =>
      v.selectedOptions?.every((opt) => selectedOptions[opt.name] === opt.value),
    ) ?? variants[0];

  const isOptionValueAvailable = (optionName: string, value: string) => {
    return variants.some((v) =>
      v.selectedOptions?.some(
        (opt) => opt.name === optionName && opt.value === value,
      ),
    );
  };

  return (
    <div className="space-y-4">
      {options.map((option) => (
        <div key={option.name}>
          <label className="block text-sm font-medium mb-2">
            {option.name}
          </label>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value;
              const isAvailable = isOptionValueAvailable(option.name, value);

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleChange(option.name, value)}
                  disabled={!isAvailable}
                  className={`px-4 py-2 border text-sm font-medium transition-colors ${
                    isSelected
                      ? 'border-black bg-black text-white'
                      : !isAvailable
                        ? 'border-neutral-200 text-neutral-400 cursor-not-allowed'
                        : 'border-neutral-300 hover:border-black'
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
