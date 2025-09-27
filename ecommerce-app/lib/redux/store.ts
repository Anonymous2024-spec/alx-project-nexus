import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers } from "@reduxjs/toolkit";

import productSlice from "./slices/productSlice";
import userSlice from "./slices/userSlice";
import wishlistSlice from "./slices/wishlistSlice";
import cartSlice from "./slices/cartSlice"; // Add cart slice

// Persist config
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["cart", "wishlist", "user"], // Persist cart, wishlist, and user
  blacklist: ["products"], // Don't persist products (fetch fresh)
};

const rootReducer = combineReducers({
  products: productSlice,
  user: userSlice,
  wishlist: wishlistSlice,
  cart: cartSlice, // Add cart reducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
