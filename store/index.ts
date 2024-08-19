import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./products/products-slice";

const store = configureStore({
  reducer: {
    products: productsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export default store;
