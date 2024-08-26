import mongoose, { Schema, Document } from "mongoose";

export interface Review extends Document {
  _id: string;
  productId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  username: string;
  rating: number;
  comment: string;
  timestamp: Date;
}

const ReviewSchema: Schema<Review> = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ReviewModel =
  (mongoose.models.Review as mongoose.Model<Review>) ||
  mongoose.model<Review>("Review", ReviewSchema);

export default ReviewModel;
