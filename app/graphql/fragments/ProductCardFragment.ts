export const ProductCardFragment = `#graphql
  fragment ProductCard on Product {
    id
    handle
    title
    vendor
    featuredImage {
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 1) {
      nodes {
        id
        availableForSale
      }
    }
    metafields(identifiers: [{ namespace: "custom", key: "badge" }]) {
      key
      value
    }
  }
`;
