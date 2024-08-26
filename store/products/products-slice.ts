import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FoodItem } from "@/types";
import baseAPI from "@/app/api/baseAPI";

export interface ProductState {
  products: FoodItem[];
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  status: "idle",
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "idle";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

// Define the async thunk to fetch products from the server
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await baseAPI.get("/products");
      return response.data.products; // Ensure you are returning the products array
    } catch (error) {
      // Cast the error to a more specific type
      const errorMessage =
        (error as Error).message || "Failed to fetch products";
      return rejectWithValue(errorMessage);
    }
  }
);

export default productsSlice.reducer;
