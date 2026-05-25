import { Favorite } from "@/models/favorites"
import type { ClientSession } from "mongoose"

export const favoriteRepository = {
  findByUserAndSnippet(userId: string, snippetId: string) {
    return Favorite.findOne({ user: userId, snippet: snippetId }).lean()
  },

  findByUserAndSnippets(userId: string, snippetIds: string[]) {
    return Favorite.find({
      user: userId,
      snippet: { $in: snippetIds },
    }).lean()
  },

  create(userId: string, snippetId: string, session?: ClientSession) {
    return Favorite.create([{ user: userId, snippet: snippetId }], {
      session,
    }).then(([doc]) => doc)
  },

  deleteByUserAndSnippet(
    userId: string,
    snippetId: string,
    session?: ClientSession
  ) {
    return Favorite.deleteOne({ user: userId, snippet: snippetId }, { session })
  },
}
