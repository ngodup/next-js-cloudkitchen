// model/UserProfile.ts

import mongoose, { Schema, Document } from "mongoose";

export interface UserProfile extends Document {
  userId: mongoose.Types.ObjectId;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  gender?: string;
  bio?: string;
  avatarUrl?: string;
  lastUpdated: Date;
}

const UserProfileSchema: Schema<UserProfile> = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User reference is required"],
    unique: true,
  },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  phoneNumber: {
    type: String,
    validate: {
      validator: function (v: string) {
        return /^\d{10}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  dateOfBirth: { type: Date },
  gender: {
    type: String,
    enum: ["male", "female", "other", "prefer not to say"],
  },
  bio: { type: String, maxlength: 500 },
  avatarUrl: { type: String },
  lastUpdated: { type: Date, default: Date.now },
});

UserProfileSchema.pre("save", function (next) {
  this.lastUpdated = new Date();
  next();
});

const UserProfileModel =
  mongoose.models.UserProfile ||
  mongoose.model<UserProfile>("UserProfile", UserProfileSchema);

export default UserProfileModel;
