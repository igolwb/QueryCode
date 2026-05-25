import mongoose, { Schema, models, model } from "mongoose"

const UserSchema = new Schema(
  {
    auth0Id: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },

    profileImage: {
      type: String,
      default: "", // URL from blob storage
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      default: "",
      maxlength: 200,
    },

    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
UserSchema.index({ auth0Id: 1 }, { unique: true })
UserSchema.index({ email: 1 }, { unique: true })

export const User = models.User || model("User", UserSchema)
