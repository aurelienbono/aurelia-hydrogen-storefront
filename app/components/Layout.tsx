import { useState } from 'react';
import { useRouteLoaderData } from '@remix-run/react';
import { Header } from './Header';
import { CartDrawer } from './CartDrawer';
import { CartProvider, useCartContext } from '~/context/CartContext';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const {
    cart,
    lines,
    cartCount,
    updateQuantity,
    removeLine,
    isPending,
  } = useCartContext();

  return (
    <>
      <Header cartCount={cartCount} onCartClick={() => setCartOpen(true)} />
      <main className="min-h-screen">
        {children}
      </main>
      <CartDrawer
        cart={cart}
        lines={lines}
        cartCount={cartCount}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemove={removeLine}
        isPending={isPending}
      />
    </>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const rootData = useRouteLoaderData<{ cart?: unknown }>('root');

  return (
    <CartProvider cart={rootData?.cart ?? null}>
      <LayoutContent>{children}</LayoutContent>
    </CartProvider>
  );
}
