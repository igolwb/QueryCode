import mongoose, { Schema, models, model } from "mongoose"

const FavoriteSchema = new Schema(
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

FavoriteSchema.index({ user: 1, snippet: 1 }, { unique: true })
FavoriteSchema.index({ snippet: 1 })

export const Favorite = models.Favorite || model("Favorite", FavoriteSchema)
