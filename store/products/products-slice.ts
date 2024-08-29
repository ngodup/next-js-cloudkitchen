import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IFoodItem } from "@/types";
import axios from "axios";

export interface ProductState {
  products: IFoodItem[];
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  status: "idle",
  error: null,
};

// Define the async thunk to fetch products from the server
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      // Perform the API request to fetch products
      const response = await axios.get("/api/products");

      // Log the fetched data to help with debugging
      console.log("Fetched products:", response.data.products);

      // Ensure the data is an array of products
      return response.data.products;
    } catch (error) {
      console.error("Error fetching products:", error);

      // Cast the error to a more specific type and handle it
      const errorMessage =
        (error as Error).message || "Failed to fetch products";
      return rejectWithValue(errorMessage);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        // Update state when the fetch is in progress
        state.status = "loading";
        state.error = null; // Reset any previous errors
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        // Update state when the fetch succeeds
        state.status = "idle";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        // Update state when the fetch fails
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default productsSlice.reducer;
