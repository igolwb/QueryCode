import mongoose, { Schema, models, model } from "mongoose"

const LanguageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Language = models.Language || model("Language", LanguageSchema)
