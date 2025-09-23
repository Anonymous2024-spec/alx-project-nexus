export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
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
  sortBy: 'price_asc' | 'price_desc' | 'rating' | 'name';
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}