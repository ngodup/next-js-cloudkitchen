import { createSlice } from "@reduxjs/toolkit";
import { products } from "@/constants/data";
import { FoodsState } from "@/types";

const initialState: FoodsState = {
  products: products,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
});

export default productsSlice.reducer;
