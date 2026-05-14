import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    auth0Id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    user_name: {
      type: String,
      required: true,
      trim: true,
    },

    user_pfp: {
      type: String,
      default: "", // URL from blob storage
    },

    user_email: {
      type: String,
      required: true,
      index: true,
    },

    user_bio: {
      type: String,
      default: "",
    },

    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
UserSchema.index({ auth0Id: 1 });
UserSchema.index({ user_email: 1 });

export const User =
  models.User || model("User", UserSchema);