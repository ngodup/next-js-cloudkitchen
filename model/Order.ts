import mongoose, { Schema, Document } from "mongoose";

export interface OrderProduct {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface Order extends Document {
  userId: mongoose.Types.ObjectId;
  products: OrderProduct[];
  totalItems: number;
  totalPrice: number;
  orderDate: Date;
  status: string;
}

const OrderProductSchema: Schema<OrderProduct> = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const OrderSchema: Schema<Order> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  products: {
    type: [OrderProductSchema],
    required: [true, "Order must contain at least one product"],
  },
  totalItems: {
    type: Number,
    required: [true, "Total number of items is required"],
  },
  totalPrice: {
    type: Number,
    required: [true, "Total price is required"],
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
  },
});

const OrderModel =
  (mongoose.models.Order as mongoose.Model<Order>) ||
  mongoose.model<Order>("Order", OrderSchema);

export default OrderModel;
