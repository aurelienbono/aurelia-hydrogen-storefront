export const MetaobjectQuery = `#graphql
  query Metaobject($handle: String!, $type: String!) {
    metaobject(handle: { handle: $handle, type: $type }) {
      id
      handle
      type
      fields {
        key
        value
        type
        reference {
          ... on MediaImage {
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
  }
`;
