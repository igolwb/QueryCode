import mongoose, { Schema, models, model } from "mongoose";

const SnippetSchema = new Schema(
  {
    snippet_name: {
      type: String,
      required: true,
      trim: true,
    },
    snippet_lang: {
      type: String,
      required: true,
      index: true,
    },
    snippet_tags: {
      type: [String],
      default: [],
      index: true,
    },
    snippet_code: {
      type: String,
      required: true,
    },
    snippet_desc: {
      type: String,
      default: "",
    },
    snippet_visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
      index: true,
    },

    // Ownership
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Engagement counters (derived data)
    likesCount: {
      type: Number,
      default: 0,
    },
    favoritesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
SnippetSchema.index({ owner: 1 });
SnippetSchema.index({ snippet_visibility: 1 });
SnippetSchema.index({ snippet_tags: 1 });
SnippetSchema.index({ snippet_lang: 1 });

export const Snippet =
  models.Snippet || model("Snippet", SnippetSchema);