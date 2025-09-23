import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product, ProductState, ProductFilters } from "../../../types/product";
import { apolloClient } from "@/lib/graphql/client";
import {
  GET_PRODUCTS,
  GET_CATEGORIES,
  GET_PRODUCT_BY_ID,
} from "@/lib/graphql/queries";

// GraphQL Async Thunks
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (variables?: { limit?: number; offset?: number }) => {
    try {
      const { data } = await apolloClient.query({
        query: GET_PRODUCTS,
        variables: variables || { limit: 20, offset: 0 },
        fetchPolicy: "cache-first", // Use cache when available
      });
      return data.products as Product[];
    } catch (error) {
      console.error("GraphQL Error fetching products:", error);
      throw error;
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async () => {
    try {
      const { data } = await apolloClient.query({
        query: GET_CATEGORIES,
        fetchPolicy: "cache-first",
      });
      return data.categories as string[];
    } catch (error) {
      console.error("GraphQL Error fetching categories:", error);
      throw error;
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id: number) => {
    try {
      const { data } = await apolloClient.query({
        query: GET_PRODUCT_BY_ID,
        variables: { id },
        fetchPolicy: "cache-first",
      });
      return data.product as Product;
    } catch (error) {
      console.error("GraphQL Error fetching product:", error);
      throw error;
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
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch products via GraphQL";
      })
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch categories via GraphQL";
      })
      // Fetch Single Product
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        // Update product in array if it exists, or add it
        const existingIndex = state.products.findIndex(
          (p) => p.id === action.payload.id
        );
        if (existingIndex >= 0) {
          state.products[existingIndex] = action.payload;
        } else {
          state.products.push(action.payload);
        }
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch product via GraphQL";
      });
  },
});

export const { setSearchQuery, setFilters, clearFilters, clearError } =
  productSlice.actions;
export default productSlice.reducer;
