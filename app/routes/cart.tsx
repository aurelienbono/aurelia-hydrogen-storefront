import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import type {
  LoaderFunctionArgs,
  ActionFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { Image } from '@shopify/hydrogen';
import { useCartContext } from '~/context/CartContext';
import type { Cart, CartLine } from '~/lib/cart.types';

const CART_ACTIONS = {
  ADD: 'ADD_TO_CART',
  UPDATE: 'UPDATE_LINE',
  REMOVE: 'REMOVE_LINE',
} as const;

export const meta: MetaFunction = () => [
  { title: 'Cart | Premium Fashion' },
  { name: 'description', content: 'Review your cart and proceed to checkout.' },
];

export async function loader({ context }: LoaderFunctionArgs) {
  const { cart } = context;
  const cartData = await cart.get();
  return json({ cart: cartData as Cart | null });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { cart } = context;

  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  const formData = await request.formData();
  const cartAction = formData.get('cartAction') as string | null;

  try {
    switch (cartAction) {
      case CART_ACTIONS.ADD: {
        const cartLines = formData.get('cartLines');
        if (!cartLines) {
          return json({ error: 'Missing cartLines' }, { status: 400 });
        }
        const lines = JSON.parse(cartLines as string) as Array<{
          merchandiseId: string;
          quantity: number;
        }>;
        await cart.linesAdd(lines);
        break;
      }
      case CART_ACTIONS.UPDATE: {
        const lines = formData.get('lines');
        if (!lines) {
          return json({ error: 'Missing lines' }, { status: 400 });
        }
        const updates = JSON.parse(lines as string) as Array<{
          id: string;
          quantity: number;
        }>;
        await cart.linesUpdate(updates);
        break;
      }
      case CART_ACTIONS.REMOVE: {
        const lineIds = formData.get('lineIds');
        if (!lineIds) {
          return json({ error: 'Missing lineIds' }, { status: 400 });
        }
        const ids = JSON.parse(lineIds as string) as string[];
        await cart.linesRemove(ids);
        break;
      }
      default:
        return json({ error: `Unknown action: ${cartAction}` }, { status: 400 });
    }

    const cartData = await cart.get();
    return json({ cart: cartData as Cart | null });
  } catch (error) {
    console.error('Cart action error:', error);
    return json(
      { error: error instanceof Error ? error.message : 'Cart operation failed' },
      { status: 500 },
    );
  }
}

export default function CartPage() {
  const loaderData = useLoaderData<typeof loader>();
  const { cart, lines } = useCartContext();

  // Use context cart (with optimistic updates) when available, else loader
  const displayCart = cart ?? loaderData.cart;
  const displayLines = lines.length > 0 ? lines : displayCart?.lines?.nodes ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
      <CartContent cart={displayCart} lines={displayLines} />
    </div>
  );
}

function CartContent({
  cart,
  lines,
}: {
  cart: Cart | null;
  lines: CartLine[];
}) {
  const { updateQuantity, removeLine } = useCartContext();

  if (lines.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-neutral-500 mb-6">Your cart is empty.</p>
        <Link
          to="/collections/all"
          className="inline-block px-6 py-3 bg-black text-white font-medium hover:bg-neutral-800 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <ul className="divide-y divide-neutral-200">
          {lines.map((line: CartLine) => (
            <CartLineItem
              key={line.id}
              line={line}
              onUpdateQuantity={updateQuantity}
              onRemove={removeLine}
            />
          ))}
        </ul>
      </div>
      <div>
        <CartSummary cart={cart} />
      </div>
    </div>
  );
}

function CartLineItem({
  line,
  onUpdateQuantity,
  onRemove,
}: {
  line: CartLine;
  onUpdateQuantity: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
}) {
  return (
    <li className="py-6 flex gap-4">
      {line.merchandise?.image && (
        <div className="w-24 h-32 flex-shrink-0 bg-neutral-100">
          <Image
            data={line.merchandise.image}
            width={96}
            height={128}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium">{line.merchandise?.product?.title}</p>
        {line.merchandise?.title !== 'Default Title' && (
          <p className="text-sm text-neutral-500">{line.merchandise?.title}</p>
        )}
        <p className="text-sm mt-1">
          {line.merchandise?.price?.amount}{' '}
          {line.merchandise?.price?.currencyCode}
        </p>
        <CartLineActions
          line={line}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
        />
      </div>
      <div className="text-right">
        <p className="font-medium">
          {(
            parseFloat(line.merchandise?.price?.amount ?? '0') * line.quantity
          ).toFixed(2)}{' '}
          {line.merchandise?.price?.currencyCode}
        </p>
      </div>
    </li>
  );
}

function CartLineActions({
  line,
  onUpdateQuantity,
  onRemove,
}: {
  line: CartLine;
  onUpdateQuantity: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 mt-3">
      <div className="flex items-center border border-neutral-300">
        <button
          type="button"
          onClick={() => onUpdateQuantity(line.id, line.quantity - 1)}
          className="px-2 py-1 text-sm hover:bg-neutral-100"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="px-3 py-1 text-sm min-w-[2rem] text-center">
          {line.quantity}
        </span>
        <button
          type="button"
          onClick={() => onUpdateQuantity(line.id, line.quantity + 1)}
          className="px-2 py-1 text-sm hover:bg-neutral-100"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={() => onRemove(line.id)}
        className="text-sm text-neutral-500 hover:text-red-600 underline"
      >
        Remove
      </button>
    </div>
  );
}

function CartSummary({ cart }: { cart: Cart | null }) {
  const subtotal = cart?.cost?.subtotalAmount;

  return (
    <div className="sticky top-24 p-6 border border-neutral-200 bg-neutral-50">
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>
            {subtotal?.amount} {subtotal?.currencyCode}
          </span>
        </div>
        <p className="text-xs text-neutral-500">
          Shipping and taxes calculated at checkout.
        </p>
        {cart?.checkoutUrl && (
          <a
            href={cart.checkoutUrl}
            className="block w-full py-3 text-center bg-black text-white font-medium hover:bg-neutral-800 transition-colors"
          >
            Proceed to Checkout
          </a>
        )}
        <Link
          to="/collections/all"
          className="block w-full py-2 text-center text-sm text-neutral-600 hover:text-black"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
