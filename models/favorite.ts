import mongoose, { Schema, models, model } from "mongoose";

const FavoriteSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    snippet: {
      type: Schema.Types.ObjectId,
      ref: "Snippet",
      required: true,
      index: true,
    },
  }
);

FavoriteSchema.index({ user: 1, snippet: 1 }, { unique: true });

export const Favorite =
  models.Favorite || model("Favorite", FavoriteSchema);