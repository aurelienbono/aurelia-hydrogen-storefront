export const CollectionsListQuery = `#graphql
  query Collections($first: Int!, $after: String) {
    collections(first: $first, after: $after) {
      nodes {
        id
        handle
        title
        description
        image {
          url
          altText
          width
          height
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;
