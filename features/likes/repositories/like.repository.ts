import { Like } from "@/models/likes"
import type { ClientSession } from "mongoose"

export const likeRepository = {
  findByUserAndSnippet(userId: string, snippetId: string) {
    return Like.findOne({ user: userId, snippet: snippetId }).lean()
  },

  findByUserAndSnippets(userId: string, snippetIds: string[]) {
    return Like.find({ user: userId, snippet: { $in: snippetIds } }).lean()
  },

  create(userId: string, snippetId: string, session?: ClientSession) {
    return Like.create([{ user: userId, snippet: snippetId }], {
      session,
    }).then(([doc]) => doc)
  },

  deleteByUserAndSnippet(
    userId: string,
    snippetId: string,
    session?: ClientSession
  ) {
    return Like.deleteOne({ user: userId, snippet: snippetId }, { session })
  },
}
