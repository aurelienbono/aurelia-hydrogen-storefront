import { createContext, useContext } from 'react';
import { useCart } from '~/hooks/useCart';

type CartContextType = ReturnType<typeof useCart> | null;

const CartContext = createContext<CartContextType>(null);

export function CartProvider({
  cart,
  children,
}: {
  cart: unknown;
  children: React.ReactNode;
}) {
  const value = useCart(cart as Parameters<typeof useCart>[0]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartContext must be used within CartProvider');
  return ctx;
}
