import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product, ProductState, ProductFilters } from "../../../types/product";
import { apolloClient } from "@/lib/graphql/client";
import {
  GET_PRODUCTS,
  GET_CATEGORIES,
  GET_PRODUCT_BY_ID,
} from "@/lib/graphql/queries";

// GraphQL Async Thunks with proper error handling
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (variables?: {
    limit?: number;
    offset?: number;
    category?: string;
    search?: string;
  }) => {
    try {
      const { data } = await apolloClient.query<{ products?: Product[] }>({
        query: GET_PRODUCTS,
        variables: variables || { limit: 20, offset: 0 },
        fetchPolicy: "cache-first",
      });

      // Debug: Check the actual response structure
      console.log("Products API response:", data);

      // Handle different response formats
      if (data && data.products) {
        return data.products as Product[];
      } else if (data && Array.isArray(data)) {
        return data as Product[]; // Direct array response
      } else {
        console.warn("Unexpected products response format:", data);
        return []; // Return empty array as fallback
      }
    } catch (error: any) {
      console.error("GraphQL Error fetching products:", error);
      throw new Error(error.message || "Failed to fetch products");
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apolloClient.query<{ categories: string[] }>({
        query: GET_CATEGORIES,
        fetchPolicy: "cache-first",
      });

      console.log("GraphQL Categories Response:", data);

      // FIX: Handle the correct response format
      if (data && data.categories && Array.isArray(data.categories)) {
        return data.categories;
      } else {
        console.warn("Unexpected categories format from GraphQL:", data);
        return rejectWithValue("Invalid categories response format");
      }
    } catch (error: any) {
      console.error("GraphQL Error fetching categories:", error);
      return rejectWithValue(error.message || "Failed to fetch categories");
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id: number) => {
    try {
      const { data } = await apolloClient.query<{ product?: Product }>({
        query: GET_PRODUCT_BY_ID,
        variables: { id },
        fetchPolicy: "cache-first",
      });

      // Handle response format
      if (data && data.product) {
        return data.product as Product;
      } else if (data && typeof data === "object") {
        return data as Product; // Direct object response
      } else {
        throw new Error("Invalid product response format");
      }
    } catch (error: any) {
      console.error("GraphQL Error fetching product:", error);
      throw new Error(error.message || "Failed to fetch product");
    }
  }
);

const initialState: ProductState = {
  products: [],
  categories: [],
  loading: false,
  error: null,
  filters: {
    category: null,
    priceRange: { min: 0, max: 1000 },
    sortBy: "name",
  },
  searchQuery: "",
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.searchQuery = "";
    },
    clearError: (state) => {
      state.error = null;
    },
    // Add a reducer to manually set products (useful for search/filter results)
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      })
      // Fetch Single Product
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        const existingIndex = state.products.findIndex(
          (p) => p.id === action.payload.id
        );
        if (existingIndex >= 0) {
          state.products[existingIndex] = action.payload;
        } else {
          state.products.push(action.payload);
        }
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch product";
      });
  },
});

export const {
  setSearchQuery,
  setFilters,
  clearFilters,
  clearError,
  setProducts,
} = productSlice.actions;

export default productSlice.reducer;
