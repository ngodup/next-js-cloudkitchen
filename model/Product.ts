import mongoose, { Schema, Document } from "mongoose";

export interface Product extends Document {
  name: string;
  imageName: string;
  rating: number;
  reviews: number;
  price: number;
  repas: string;
  repasType: string;
  cuisine: string;
  isActive: boolean;
}

const ProductSchema: Schema<Product> = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
  },
  imageName: {
    type: String,
    required: [true, "Product image name is required"],
  },
  rating: Number,
  reviews: Number,
  repas: {
    type: String,
    required: true,
  },
  repasType: {
    type: String,
    required: [true, "Product type is required"],
  },
  cuisine: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

const ProductModel =
  (mongoose.models.Product as mongoose.Model<Product>) ||
  mongoose.model<Product>("Product", ProductSchema);

export default ProductModel;
