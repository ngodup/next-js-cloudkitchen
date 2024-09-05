import mongoose, { Schema, Document } from "mongoose";

export interface Address extends Document {
  userId: mongoose.Types.ObjectId;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
}

const AddressSchema: Schema<Address> = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User reference is required"],
  },
  street: {
    type: String,
    required: [true, "Street address is required"],
    maxlength: [100, "Street address cannot exceed 100 characters"],
  },
  city: {
    type: String,
    required: [true, "City is required"],
    maxlength: [50, "City name cannot exceed 50 characters"],
  },
  state: {
    type: String,
    required: [true, "State is required"],
    maxlength: [50, "State name cannot exceed 50 characters"],
  },
  zip: {
    type: String,
    required: [true, "ZIP code is required"],
    maxlength: [6, "ZIP code cannot exceed 6 characters"],
    minlength: [5, "ZIP code cannot less than 5 characters"],
  },
  country: {
    type: String,
    required: [true, "Country is required"],
    maxlength: [50, "Country name cannot exceed 50 characters"],
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AddressModel =
  (mongoose.models.Address as mongoose.Model<Address>) ||
  mongoose.model<Address>("Address", AddressSchema);

export default AddressModel;
