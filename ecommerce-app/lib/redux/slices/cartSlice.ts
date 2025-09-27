import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../../types/product";

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  addedAt: string; // Store as ISO string for serialization
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; quantity?: number }>
    ) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id: Date.now(), // Simple ID generation
          product,
          quantity,
          addedAt: new Date().toISOString(),
        });
      }
      state.error = null;
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload
      );
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ productId: number; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;

      if (quantity <= 0) {
        state.items = state.items.filter(
          (item) => item.product.id !== productId
        );
        return;
      }

      const existingItem = state.items.find(
        (item) => item.product.id === productId
      );

      if (existingItem) {
        existingItem.quantity = quantity;
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.error = null;
    },

    incrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(
        (item) => item.product.id === action.payload
      );
      if (item) {
        item.quantity += 1;
      }
    },

    decrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(
        (item) => item.product.id === action.payload
      );
      if (item) {
        if (item.quantity <= 1) {
          state.items = state.items.filter(
            (cartItem) => cartItem.product.id !== action.payload
          );
        } else {
          item.quantity -= 1;
        }
      }
    },

    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setCartError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Bulk operations for cart management
    addMultipleToCart: (
      state,
      action: PayloadAction<{ product: Product; quantity: number }[]>
    ) => {
      action.payload.forEach(({ product, quantity }) => {
        const existingItem = state.items.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          state.items.push({
            id: Date.now() + Math.random(), // Ensure unique IDs
            product,
            quantity,
            addedAt: new Date().toISOString(),
          });
        }
      });
    },

    removeMultipleFromCart: (state, action: PayloadAction<number[]>) => {
      state.items = state.items.filter(
        (item) => !action.payload.includes(item.product.id)
      );
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  incrementQuantity,
  decrementQuantity,
  setCartLoading,
  setCartError,
  addMultipleToCart,
  removeMultipleFromCart,
} = cartSlice.actions;

export default cartSlice.reducer;
