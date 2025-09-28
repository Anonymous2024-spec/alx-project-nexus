import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "../store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Cart-specific hooks
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  incrementQuantity,
  decrementQuantity,
} from "../slices/cartSlice";
import {
  selectCartItems,
  selectCartItemCount,
  selectCartTotal,
  selectIsInCart,
  selectCartItemById,
  selectCartSummary,
} from "../selectors/cartSelectors";
import { Product } from "../../../types/product";

export const useCart = () => {
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector(selectCartItems);
  const cartItemCount = useAppSelector(selectCartItemCount);
  const cartTotal = useAppSelector(selectCartTotal);
  const cartSummary = useAppSelector(selectCartSummary);

  return {
    // State
    cartItems,

    // Actions
    addToCart: (product: Product, quantity = 1) =>
      dispatch(addToCart({ product, quantity })),

    removeFromCart: (productId: number) => dispatch(removeFromCart(productId)),

    updateQuantity: (productId: number, quantity: number) =>
      dispatch(updateQuantity({ productId, quantity })),

    clearCart: () => dispatch(clearCart()),

    incrementQuantity: (productId: number) =>
      dispatch(incrementQuantity(productId)),

    decrementQuantity: (productId: number) =>
      dispatch(decrementQuantity(productId)),

    // Functions to match your existing interface
    getCartTotal: () => cartTotal,
    getCartItemCount: () => cartItemCount,

    // Selectors as functions
    isInCart: (productId: number) =>
      useAppSelector((state) => selectIsInCart(state, productId)),

    getCartItem: (productId: number) =>
      useAppSelector((state) => selectCartItemById(state, productId)),
  };
};

// Wishlist hooks (if you want to follow the same pattern)
import {
  addToWishlist,
  removeFromWishlist,
  toggleWishlistItem,
  clearWishlist,
} from "../slices/wishlistSlice";

export const useWishlist = () => {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  return {
    wishlistItems,
    addToWishlist: (product: Product) => dispatch(addToWishlist(product)),
    removeFromWishlist: (productId: number) =>
      dispatch(removeFromWishlist(productId)),
    toggleWishlistItem: (product: Product) =>
      dispatch(toggleWishlistItem(product)),
    clearWishlist: () => dispatch(clearWishlist()),
    isInWishlist: (productId: number) =>
      wishlistItems.some((item) => item.id === productId),
  };
};
