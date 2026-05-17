import mongoose, { Schema, models, model } from "mongoose"

const SnippetSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },

    language: {
      type: Schema.Types.ObjectId,
      ref: "Language",
      required: true,
    },

    // Canonical tag links — see AGENTS.md "Tags"
    tags: {
      type: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
      required: true,
    validate: { validator: (
      v: mongoose.Types.ObjectId[]
    ) => v.length > 0,
        message: "A snippet must have at least one tag",
      },
    },

    code: {
      type: String,
      required: true,
      maxlength: 10000,
    },

    description: {
      type: String,
      default: "",
      maxlength:500,
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Engagement counters (derived data) — keep in sync with Like / Favorite in app code
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    favoritesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
)

SnippetSchema.index({ owner: 1 })
SnippetSchema.index({ visibility: 1 })
SnippetSchema.index({ tags: 1 })
SnippetSchema.index({ language: 1 })

export const Snippet = models.Snippet || model("Snippet", SnippetSchema)
