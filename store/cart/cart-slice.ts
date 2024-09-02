import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IOrderProduct } from "@/types";
import { RootState } from "@/store";

// Types
export interface CartState {
  userId: string | null;
  products: IOrderProduct[];
  totalItems: number;
  totalPrice: number;
  status: "pending" | "processing" | "completed" | "cancelled";
}

const initialState: CartState = {
  userId: null,
  products: [],
  totalItems: 0,
  totalPrice: 0,
  status: "pending",
};
// const { products, totalItems, totalPrice, status } = body;
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    addToCart: (
      state,
      action: PayloadAction<Omit<IOrderProduct, "quantity">>
    ) => {
      const existingProduct = state.products.find(
        (product) => product.productId === action.payload.productId
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        state.products.push({ ...action.payload, quantity: 1 });
      }

      state.totalItems += 1;
      state.totalPrice += action.payload.price;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const productIndex = state.products.findIndex(
        (product) => product.productId === action.payload
      );

      if (productIndex !== -1) {
        const product = state.products[productIndex];
        state.totalItems -= product.quantity;
        state.totalPrice -= product.price * product.quantity;
        state.products.splice(productIndex, 1);
      }
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const product = state.products.find(
        (p) => p.productId === action.payload.productId
      );
      if (product) {
        const quantityDifference = action.payload.quantity - product.quantity;
        product.quantity = Math.max(0, action.payload.quantity);
        state.totalItems += quantityDifference;
        state.totalPrice += quantityDifference * product.price;

        if (product.quantity === 0) {
          state.products = state.products.filter(
            (p) => p.productId !== action.payload.productId
          );
        }
      }
    },
    clearCart: (state) => {
      state.products = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
    setStatus: (state, action: PayloadAction<CartState["status"]>) => {
      state.status = action.payload;
    },
  },
});

export const {
  setUserId,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setStatus,
} = cartSlice.actions;

// Selectors
export const selectCartItemQuantity = (state: RootState, productId: string) => {
  const product = state.cart.products.find((p) => p.productId === productId);
  return product ? product.quantity : 0;
};
export const selectCart = (state: RootState) => state.cart;
export const selectCartProducts = (state: RootState) => state.cart.products;
export const selectCartTotalItems = (state: RootState) => state.cart.totalItems;
export const selectCartTotalPrice = (state: RootState) => state.cart.totalPrice;
export const selectCartStatus = (state: RootState) => state.cart.status;

export default cartSlice.reducer;
