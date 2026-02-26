import { ProductDetailFragment } from '../fragments/ProductDetailFragment';

export const ProductQuery = `#graphql
  ${ProductDetailFragment}
  query Product($handle: String!, $selectedOptions: [SelectedOptionInput!]) {
    product(handle: $handle) {
      ...ProductDetail
    }
  }
`;
