import mongoose, { Schema, Document } from "mongoose";

export interface UserAuth extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
}

const UserAuthSchema: Schema<UserAuth> = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  verifyCode: {
    type: String,
    required: [true, "Verify Code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify Code Expiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpiry: {
    type: Date,
    default: null,
  },
});

// Check if the model is already registered before registering it
const UserModel =
  mongoose.models.User || mongoose.model<UserAuth>("User", UserAuthSchema);

export default UserModel;
