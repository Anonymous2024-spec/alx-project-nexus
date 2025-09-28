// types/product.ts
export interface Product {
  id: number;
  title: string; // Mapped from API's "name"
  description: string; // Generated or from API if available
  price: number; // Converted from string to number
  category: string; // Mapped from API's "category_name"
  image: string; // Mapped from API's "primary_image" or placeholder
  rating: {
    rate: number; // Generated since API doesn't provide ratings
    count: number; // Generated since API doesn't provide ratings
  };

  // Additional fields from API that might be useful
  brand?: string;
  stock_quantity?: number;
  seller_name?: string;
  is_featured?: boolean;
  created_at?: string;
  sku?: string;
  seller?: number;
  is_active?: boolean;
  is_in_stock?: boolean;
  is_low_stock?: boolean;
  sales_count?: number;
}

export interface ProductState {
  products: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
  searchQuery: string;
}

export interface ProductFilters {
  category: string | null;
  priceRange: {
    min: number;
    max: number;
  };
  sortBy: "price_asc" | "price_desc" | "rating" | "name" | "newest";
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Raw API response types (for internal use)
export interface ApiProduct {
  id: number;
  name: string;
  price: string; // API returns price as string
  sku: string;
  category: number;
  category_name: string;
  seller: number;
  seller_name: string;
  stock_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  sales_count: number;
  brand: string;
  is_in_stock: boolean;
  is_low_stock: boolean;
  primary_image: string | null;
  created_at: string;
  description?: string; // May or may not be present
}

export interface ApiProductsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiProduct[];
}

export interface ApiCategory {
  id: number;
  name: string;
  description?: string;
  is_active?: boolean;
}

// Search/Filter types for API
export interface ProductSearchParams {
  search?: string;
  category?: string;
  category__name?: string;
  price__gte?: number; // minimum price
  price__lte?: number; // maximum price
  ordering?:
    | "name"
    | "-name"
    | "price"
    | "-price"
    | "created_at"
    | "-created_at";
  page?: number;
  page_size?: number;
  is_featured?: boolean;
  is_active?: boolean;
  seller?: number;
}

// GraphQL variable types (for your existing queries)
export interface GraphQLProductVariables {
  limit?: number;
  offset?: number;
  category?: string;
  search?: string;
}

export interface GraphQLSearchVariables {
  search: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  limit?: number;
  offset?: number;
}

// Helper type for pagination
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
  pageSize: number;
}
