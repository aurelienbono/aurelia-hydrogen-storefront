/**
 * Typesafe cart types matching Storefront API Cart structure
 */
export interface CartImage {
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface CartLineMerchandise {
  id: string;
  title?: string;
  product?: {
    id: string;
    title?: string;
    handle?: string;
  };
  price?: {
    amount: string;
    currencyCode: string;
  };
  image?: CartImage;
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandise?: CartLineMerchandise;
}

export interface MoneyAmount {
  amount: string;
  currencyCode: string;
}

export interface Cart {
  id?: string;
  checkoutUrl?: string;
  totalQuantity?: number;
  lines?: {
    nodes: CartLine[];
  };
  cost?: {
    subtotalAmount?: MoneyAmount;
    totalAmount?: MoneyAmount;
  };
}

/** Input for adding lines to cart */
export interface CartLineAddInput {
  merchandiseId: string;
  quantity: number;
}

/** Input for updating cart lines */
export interface CartLineUpdateInput {
  id: string;
  quantity: number;
}
