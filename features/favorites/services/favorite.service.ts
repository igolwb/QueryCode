import { favoriteRepository } from "@/features/favorites/repositories/favorite.repository"
import { snippetRepository } from "@/features/snippets/repositories/snippet.repository"
import { userService } from "@/features/users/services/user.service"
import type { RequestUser } from "@/lib/auth/types"
import { ConflictError, NotFoundError } from "@/lib/api/errors"
import { runInTransaction } from "@/lib/db/transactions"
import { Snippet } from "@/models/snippets"

export const favoriteService = {
  async add(actor: RequestUser, snippetId: string) {
    const userId = await userService.resolveUserId(actor)
    const snippet = await snippetRepository.findById(snippetId)
    if (!snippet) {
      throw new NotFoundError("Snippet not found")
    }

    const existing = await favoriteRepository.findByUserAndSnippet(
      userId,
      snippetId
    )
    if (existing) {
      throw new ConflictError("Snippet already favorited")
    }

    await runInTransaction(async (session) => {
      await favoriteRepository.create(userId, snippetId, session)
      await Snippet.updateOne(
        { _id: snippetId },
        { $inc: { favoritesCount: 1 } },
        { session }
      )
    })

    return { snippetId, favorited: true }
  },

  async remove(actor: RequestUser, snippetId: string) {
    const userId = await userService.resolveUserId(actor)
    const existing = await favoriteRepository.findByUserAndSnippet(
      userId,
      snippetId
    )
    if (!existing) {
      throw new NotFoundError("Favorite not found")
    }

    await runInTransaction(async (session) => {
      await favoriteRepository.deleteByUserAndSnippet(
        userId,
        snippetId,
        session
      )
      await Snippet.updateOne(
        { _id: snippetId },
        { $inc: { favoritesCount: -1 } },
        { session }
      )
    })

    return { snippetId, favorited: false }
  },
}
