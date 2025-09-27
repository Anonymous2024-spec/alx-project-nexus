import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Basic selectors
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartLoading = (state: RootState) => state.cart.loading;
export const selectCartError = (state: RootState) => state.cart.error;

// Memoized selectors using createSelector
export const selectCartItemCount = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.quantity, 0)
);

export const selectCartTotal = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.product.price * item.quantity, 0)
);

export const selectCartItemById = createSelector(
  [selectCartItems, (state: RootState, productId: number) => productId],
  (items, productId) => items.find((item) => item.product.id === productId)
);

export const selectIsInCart = createSelector(
  [selectCartItems, (state: RootState, productId: number) => productId],
  (items, productId) => items.some((item) => item.product.id === productId)
);

export const selectCartItemsByCategory = createSelector(
  [selectCartItems],
  (items) => {
    return items.reduce(
      (acc, item) => {
        const category = item.product.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(item);
        return acc;
      },
      {} as Record<string, typeof items>
    );
  }
);

export const selectCartSummary = createSelector([selectCartItems], (items) => ({
  itemCount: items.reduce((total, item) => total + item.quantity, 0),
  totalPrice: items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  ),
  uniqueItems: items.length,
  categories: [...new Set(items.map((item) => item.product.category))],
}));
