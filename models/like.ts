import mongoose, { Schema, models, model } from "mongoose";

const LikeSchema = new Schema(
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
  },
  {
    timestamps: true,
  }
);

LikeSchema.index({ user: 1, snippet: 1 }, { unique: true });

export const Like =
  models.Like || model("Like", LikeSchema);