import { likeRepository } from "@/features/likes/repositories/like.repository"
import { snippetRepository } from "@/features/snippets/repositories/snippet.repository"
import { userService } from "@/features/users/services/user.service"
import type { RequestUser } from "@/lib/auth/types"
import { ConflictError, NotFoundError } from "@/lib/api/errors"
import { runInTransaction } from "@/lib/db/transactions"
import { Snippet } from "@/models/snippets"

export const likeService = {
  async add(actor: RequestUser, snippetId: string) {
    const userId = await userService.resolveUserId(actor)
    const snippet = await snippetRepository.findById(snippetId)
    if (!snippet) {
      throw new NotFoundError("Snippet not found")
    }

    const existing = await likeRepository.findByUserAndSnippet(
      userId,
      snippetId
    )
    if (existing) {
      throw new ConflictError("Snippet already liked")
    }

    await runInTransaction(async (session) => {
      await likeRepository.create(userId, snippetId, session)
      await Snippet.updateOne(
        { _id: snippetId },
        { $inc: { likesCount: 1 } },
        { session }
      )
    })

    return { snippetId, liked: true }
  },

  async remove(actor: RequestUser, snippetId: string) {
    const userId = await userService.resolveUserId(actor)
    const existing = await likeRepository.findByUserAndSnippet(
      userId,
      snippetId
    )
    if (!existing) {
      throw new NotFoundError("Like not found")
    }

    await runInTransaction(async (session) => {
      await likeRepository.deleteByUserAndSnippet(userId, snippetId, session)
      await Snippet.updateOne(
        { _id: snippetId },
        { $inc: { likesCount: -1 } },
        { session }
      )
    })

    return { snippetId, liked: false }
  },
}
