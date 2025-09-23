import { gql } from "@apollo/client";

// Get all products with pagination and filtering
export const GET_PRODUCTS = gql`
  query GetProducts(
    $limit: Int
    $offset: Int
    $category: String
    $search: String
  ) {
    products(
      limit: $limit
      offset: $offset
      category: $category
      search: $search
    ) {
      id
      title
      description
      price
      category
      image
      rating {
        rate
        count
      }
    }
  }
`;

// Get all product categories
export const GET_CATEGORIES = gql`
  query GetCategories {
    categories
  }
`;

// Get single product by ID
export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
    product(id: $id) {
      id
      title
      description
      price
      category
      image
      rating {
        rate
        count
      }
    }
  }
`;

// Search products with filters
export const SEARCH_PRODUCTS = gql`
  query SearchProducts(
    $search: String!
    $category: String
    $minPrice: Float
    $maxPrice: Float
    $sortBy: String
    $limit: Int
    $offset: Int
  ) {
    searchProducts(
      search: $search
      category: $category
      minPrice: $minPrice
      maxPrice: $maxPrice
      sortBy: $sortBy
      limit: $limit
      offset: $offset
    ) {
      products {
        id
        title
        description
        price
        category
        image
        rating {
          rate
          count
        }
      }
      totalCount
      hasMore
    }
  }
`;

// Get products by category
export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory($category: String!, $limit: Int, $offset: Int) {
    productsByCategory(category: $category, limit: $limit, offset: $offset) {
      id
      title
      description
      price
      category
      image
      rating {
        rate
        count
      }
    }
  }
`;

// Get featured/trending products
export const GET_FEATURED_PRODUCTS = gql`
  query GetFeaturedProducts($limit: Int) {
    featuredProducts(limit: $limit) {
      id
      title
      description
      price
      category
      image
      rating {
        rate
        count
      }
    }
  }
`;

// For user authentication
export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        username
        email
        firstName
        lastName
      }
      token
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser($input: UserInput!) {
    register(input: $input) {
      user {
        id
        username
        email
        firstName
        lastName
      }
      token
    }
  }
}
  `;
