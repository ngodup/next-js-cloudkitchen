import mongoose, { Schema, Document } from "mongoose";

export interface Comment extends Document {
  content: string;
  rating?: string;
  createdAt: Date;
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}

const CommentSchema: Schema<Comment> = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Comment content is required"],
    maxlength: [400, "Comment content cannot exceed 400 characters"],
  },
  rating: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product reference is required"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Author reference is required"],
  },
});

const CommentModel =
  (mongoose.models.Comment as mongoose.Model<Comment>) ||
  mongoose.model<Comment>("Comment", CommentSchema);

export default CommentModel;
