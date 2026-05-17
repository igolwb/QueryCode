import mongoose, { Schema, models, model } from "mongoose"

const LikeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    snippet: {
      type: Schema.Types.ObjectId,
      ref: "Snippet",
      required: true,
    },
  },
  {
    timestamps: true,
    updatedAt: false,
  }
)

LikeSchema.index({ user: 1, snippet: 1 }, { unique: true })
LikeSchema.index({ snippet: 1 })

export const Like = models.Like || model("Like", LikeSchema)
