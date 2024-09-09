import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IFoodItem } from "@/types";
import axios from "axios";
import { RootState } from "../index"; // Import RootState from the store index

interface FilterParams {
  search?: string;
  category?: string;
  cuisine?: string;
  priceRange?: [number, number];
  repasType?: string;
}

export interface ProductState {
  products: IFoodItem[];
  status: "idle" | "loading" | "failed";
  error: string | null;
  filterParams: FilterParams;
}

const initialState: ProductState = {
  products: [],
  status: "idle",
  error: null,
  filterParams: {},
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { filterParams } = state.products;
      const response = await axios.get("/api/products", {
        params: filterParams,
      });
      return response.data.products;
    } catch (error) {
      console.error("Error fetching products:", error);
      const errorMessage =
        (error as Error).message || "Failed to fetch products";
      return rejectWithValue(errorMessage);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilterParams: (state, action: PayloadAction<FilterParams>) => {
      state.filterParams = { ...state.filterParams, ...action.payload };
    },
    clearFilterParams: (state) => {
      state.filterParams = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "idle";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setFilterParams, clearFilterParams } = productsSlice.actions;
export default productsSlice.reducer;
