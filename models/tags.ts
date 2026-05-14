import mongoose, { Schema, models, model } from "mongoose";

const TagSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  }
);

export const Tag =
  models.Tag || model("Tag", TagSchema);