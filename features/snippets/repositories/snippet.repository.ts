import { Snippet } from "@/models/snippets"
import { Like } from "@/models/likes"
import { Favorite } from "@/models/favorites"
import type { ClientSession } from "mongoose"

const ownerPopulate = { path: "owner", select: "name profileImage" }

export const snippetRepository = {
  findById(id: string) {
    return Snippet.findById(id).populate(ownerPopulate).lean()
  },

  findMany(filter: Record<string, unknown>, skip: number, limit: number) {
    return Snippet.find(filter)
      .populate(ownerPopulate)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
  },

  count(filter: Record<string, unknown>) {
    return Snippet.countDocuments(filter)
  },

  create(
    data: {
      name: string
      code: string
      description: string
      visibility: "public" | "private"
      language: string
      tags: string[]
      owner: string
    },
    session?: ClientSession
  ) {
    return Snippet.create([data], { session }).then(([doc]) => doc)
  },

  updateById(id: string, data: Record<string, unknown>, session?: ClientSession) {
    return Snippet.findByIdAndUpdate(id, { $set: data }, { new: true, session })
      .populate(ownerPopulate)
      .lean()
  },

  deleteById(id: string, session?: ClientSession) {
    return Snippet.findByIdAndDelete(id, { session })
  },

  deleteEngagementBySnippetId(snippetId: string, session?: ClientSession) {
    return Promise.all([
      Like.deleteMany({ snippet: snippetId }, { session }),
      Favorite.deleteMany({ snippet: snippetId }, { session }),
    ])
  },
}
