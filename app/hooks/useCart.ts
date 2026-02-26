import { useCallback, useEffect, useRef, useState } from 'react';
import { useFetcher, useRevalidator } from '@remix-run/react';
import type { Cart, CartLine } from '~/lib/cart.types';

const CART_ACTIONS = {
  ADD: 'ADD_TO_CART',
  UPDATE: 'UPDATE_LINE',
  REMOVE: 'REMOVE_LINE',
} as const;

/** Pending optimistic updates */
interface OptimisticState {
  addCount: number;
  lineUpdates: Record<string, number>;
  removedLines: Set<string>;
}

export function useCart(cart: Cart | null) {
  const fetcher = useFetcher<{ cart?: Cart | null }>();
  const revalidator = useRevalidator();
  const [optimistic, setOptimistic] = useState<OptimisticState>({
    addCount: 0,
    lineUpdates: {},
    removedLines: new Set(),
  });
  const prevFetcherState = useRef(fetcher.state);

  // Clear optimistic state when fetcher completes; revalidate for fresh data
  useEffect(() => {
    if (prevFetcherState.current === 'submitting' && fetcher.state === 'idle') {
      setOptimistic({
        addCount: 0,
        lineUpdates: {},
        removedLines: new Set(),
      });
      // Revalidate root + cart loaders to sync server state
      revalidator.revalidate();
    }
    prevFetcherState.current = fetcher.state;
  }, [fetcher.state, revalidator]);

  const submit = useCallback(
    (action: string, payload: Record<string, string>) => {
      fetcher.submit(
        { cartAction: action, ...payload },
        { method: 'POST', action: '/cart' },
      );
    },
    [fetcher],
  );

  const addToCart = useCallback(
    (variantId: string, quantity: number) => {
      setOptimistic((prev) => ({ ...prev, addCount: prev.addCount + quantity }));
      submit(CART_ACTIONS.ADD, {
        cartLines: JSON.stringify([{ merchandiseId: variantId, quantity }]),
      });
    },
    [submit],
  );

  const removeLine = useCallback(
    (lineId: string) => {
      setOptimistic((prev) => ({
        ...prev,
        removedLines: new Set(prev.removedLines).add(lineId),
      }));
      submit(CART_ACTIONS.REMOVE, {
        lineIds: JSON.stringify([lineId]),
      });
    },
    [submit],
  );

  const updateQuantity = useCallback(
    (lineId: string, quantity: number) => {
      if (quantity <= 0) {
        removeLine(lineId);
        return;
      }
      setOptimistic((prev) => ({
        ...prev,
        lineUpdates: { ...prev.lineUpdates, [lineId]: quantity },
      }));
      submit(CART_ACTIONS.UPDATE, {
        lines: JSON.stringify([{ id: lineId, quantity }]),
      });
    },
    [submit, removeLine],
  );

  // Merged cart for display (optimistic + server)
  const lines = cart?.lines?.nodes ?? [];
  const displayLines = lines.filter((l) => !optimistic.removedLines.has(l.id));
  const displayLinesWithQuantity = displayLines.map((line) => ({
    ...line,
    quantity: optimistic.lineUpdates[line.id] ?? line.quantity,
  }));

  const cartCount =
    displayLinesWithQuantity.reduce((sum, l) => sum + l.quantity, 0) +
    optimistic.addCount;

  const isPending = fetcher.state === 'submitting' || revalidator.state === 'loading';

  return {
    cart: cart ?? null,
    /** Cart lines with optimistic updates applied */
    lines: displayLinesWithQuantity,
    cartCount,
    addToCart,
    updateQuantity,
    removeLine,
    isPending,
    isLoading: isPending,
  };
}
