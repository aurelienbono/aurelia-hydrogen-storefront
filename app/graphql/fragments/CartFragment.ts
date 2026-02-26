/**
 * Cart fragment for Storefront API cart queries and mutations.
 * Used for typesafe cart operations.
 */
export const CartFragment = `#graphql
  fragment CartApi on Cart {
    id
    checkoutUrl
    totalQuantity
    lines(first: 100) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            product {
              id
              title
              handle
            }
            price {
              amount
              currencyCode
            }
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
  }
`;
