export const ProductDetailFragment = `#graphql
  fragment ProductDetail on Product {
    id
    handle
    title
    description
    descriptionHtml
    vendor
    productType
    tags
    seo {
      title
      description
    }
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 20) {
      nodes {
        id
        url
        altText
        width
        height
      }
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
    options {
      name
      values
    }
    variants(first: 100) {
      nodes {
        id
        title
        availableForSale
        selectedOptions {
          name
          value
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
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
    metafields(identifiers: [
      { namespace: "custom", key: "badge" },
      { namespace: "custom", key: "size_guide" },
      { namespace: "custom", key: "material" }
    ]) {
      namespace
      key
      value
      type
    }
  }
`;
