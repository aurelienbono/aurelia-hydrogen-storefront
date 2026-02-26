import { Link } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import type { Cart, CartLine } from '~/lib/cart.types';

interface CartDrawerProps {
  cart: Cart | null;
  /** Lines with optimistic updates (from useCart) */
  lines: CartLine[];
  cartCount: number;
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
  isPending?: boolean;
}

/**
 * Mini cart drawer - slides in from right.
 * Supports add/update/remove with optimistic UI.
 */
export function CartDrawer({
  cart,
  lines,
  cartCount,
  isOpen,
  onClose,
  onUpdateQuantity,
  onRemove,
  isPending = false,
}: CartDrawerProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {lines.length === 0 ? (
            <p className="text-neutral-500 py-8 text-center">
              Your cart is empty
            </p>
          ) : (
            <ul className="space-y-4">
              {lines.map((line) => (
                <li
                  key={line.id}
                  className="flex gap-4 py-4 border-b last:border-0"
                >
                  {line.merchandise?.image && (
                    <div className="w-20 h-24 flex-shrink-0 bg-neutral-100">
                      <Image
                        data={line.merchandise.image}
                        width={80}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {line.merchandise?.product?.title}
                    </p>
                    {line.merchandise?.title !== 'Default Title' && (
                      <p className="text-sm text-neutral-500">
                        {line.merchandise?.title}
                      </p>
                    )}
                    <p className="text-sm mt-1">
                      {line.merchandise?.price?.amount}{' '}
                      {line.merchandise?.price?.currencyCode}
                    </p>
                    <CartLineControls
                      line={line}
                      onUpdateQuantity={onUpdateQuantity}
                      onRemove={onRemove}
                      disabled={isPending}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="p-4 border-t">
            <div className="flex justify-between text-lg font-semibold mb-4">
              <span>Subtotal</span>
              <span>
                {cart?.cost?.subtotalAmount?.amount}{' '}
                {cart?.cost?.subtotalAmount?.currencyCode}
              </span>
            </div>
            <Link
              to="/cart"
              onClick={onClose}
              className="block w-full py-3 text-center bg-black text-white font-medium hover:bg-neutral-800"
            >
              View Cart
            </Link>
            {cart?.checkoutUrl && (
              <a
                href={cart.checkoutUrl}
                onClick={onClose}
                className="block w-full py-3 text-center border border-black font-medium mt-2 hover:bg-neutral-100"
              >
                Checkout
              </a>
            )}
          </div>
        )}
      </div>
    </>
  );
}

function CartLineControls({
  line,
  onUpdateQuantity,
  onRemove,
  disabled,
}: {
  line: CartLine;
  onUpdateQuantity: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
  disabled?: boolean;
}) {
  const quantity = line.quantity;

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex items-center border border-neutral-300 text-sm">
        <button
          type="button"
          onClick={() => onUpdateQuantity(line.id, Math.max(1, quantity - 1))}
          disabled={disabled || quantity <= 1}
          className="px-2 py-1 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="px-2 min-w-[1.5rem] text-center">{quantity}</span>
        <button
          type="button"
          onClick={() => onUpdateQuantity(line.id, quantity + 1)}
          disabled={disabled}
          className="px-2 py-1 hover:bg-neutral-100 disabled:opacity-50"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={() => onRemove(line.id)}
        disabled={disabled}
        className="text-xs text-neutral-500 hover:text-red-600 underline disabled:opacity-50"
      >
        Remove
      </button>
    </div>
  );
}
