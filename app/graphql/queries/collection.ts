import { ProductCardFragment } from '../fragments/ProductCardFragment';

export const CollectionQuery = `#graphql
  ${ProductCardFragment}
  query Collection(
    $handle: String!
    $first: Int
    $after: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      seo {
        title
        description
      }
      products(
        first: $first
        after: $after
        sortKey: $sortKey
        reverse: $reverse
      ) {
        nodes {
          ...ProductCard
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`;
