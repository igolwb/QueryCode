import { snippetRepository } from "@/features/snippets/repositories/snippet.repository"
import { toSnippetDto } from "@/features/snippets/utils/snippet.mapper"
import type {
  CreateSnippetInput,
  SnippetDto,
  UpdateSnippetInput,
} from "@/features/snippets/types/snippet.types"
import { tagService } from "@/features/tags/services/tag.service"
import { languageService } from "@/features/languages/services/language.service"
import { userService } from "@/features/users/services/user.service"
import { likeRepository } from "@/features/likes/repositories/like.repository"
import { favoriteRepository } from "@/features/favorites/repositories/favorite.repository"
import type { RequestUser } from "@/lib/auth/types"
import { buildPaginationMeta, getSkip } from "@/lib/api/pagination"
import type { PaginatedResult } from "@/types/api"
import { ForbiddenError, NotFoundError } from "@/lib/api/errors"
import { runInTransaction } from "@/lib/db/transactions"
import { Snippet } from "@/models/snippets"

export const snippetService = {
  async list(
    actor: RequestUser | null,
    params: {
      page: number
      limit: number
      visibility?: "public" | "private"
      ownerId?: string
      language?: string
      tag?: string
      search?: string
      mine?: boolean
    }
  ): Promise<PaginatedResult<SnippetDto>> {
    const userId = actor ? await userService.resolveUserId(actor) : null
    const filter = await buildListFilter(params, userId)

    const skip = getSkip(params.page, params.limit)
    const [items, total] = await Promise.all([
      snippetRepository.findMany(filter, skip, params.limit),
      snippetRepository.count(filter),
    ])

    const engagementMap = userId
      ? await loadEngagementFlags(
          userId,
          items.map((s) => s._id.toString())
        )
      : new Map<string, { likedByMe: boolean; favoritedByMe: boolean }>()

    return {
      items: items.map((item) =>
        toSnippetDto(item, engagementMap.get(item._id.toString()))
      ),
      meta: buildPaginationMeta(total, params.page, params.limit),
    }
  },

  async getById(actor: RequestUser | null, id: string): Promise<SnippetDto> {
    const snippet = await snippetRepository.findById(id)
    if (!snippet) {
      throw new NotFoundError("Snippet not found")
    }

    const userId = actor ? await userService.resolveUserId(actor) : null
    assertCanRead(snippet.visibility, snippet.owner._id.toString(), userId)

    const engagement = userId
      ? await loadEngagementFlags(userId, [id]).then(
          (m) => m.get(id) ?? { likedByMe: false, favoritedByMe: false }
        )
      : undefined

    return toSnippetDto(snippet, engagement)
  },

  async create(
    actor: RequestUser,
    input: CreateSnippetInput
  ): Promise<SnippetDto> {
    const ownerId = await userService.resolveUserId(actor)
    const [languageId, tagIds] = await Promise.all([
      languageService.resolveLanguageId(input.language),
      tagService.resolveTagIds(input.tags),
    ])

    const snippet = await snippetRepository.create({
      name: input.name,
      code: input.code,
      description: input.description ?? "",
      visibility: input.visibility ?? "private",
      language: languageId,
      tags: tagIds,
      owner: ownerId,
    })

    const populated = await snippetRepository.findById(snippet._id.toString())
    if (!populated) {
      throw new NotFoundError("Snippet not found after create")
    }
    return toSnippetDto(populated)
  },

  async update(
    actor: RequestUser,
    id: string,
    input: UpdateSnippetInput
  ): Promise<SnippetDto> {
    const existing = await snippetRepository.findById(id)
    if (!existing) {
      throw new NotFoundError("Snippet not found")
    }

    const userId = await userService.resolveUserId(actor)
    assertIsOwner(existing.owner._id.toString(), userId)

    const updateData: Record<string, unknown> = { ...input }

    if (input.language !== undefined) {
      updateData.language = await languageService.resolveLanguageId(
        input.language
      )
    }

    if (input.tags !== undefined) {
      updateData.tags = await tagService.resolveTagIds(input.tags)
    }

    const updated = await snippetRepository.updateById(id, updateData)
    if (!updated) {
      throw new NotFoundError("Snippet not found")
    }
    return toSnippetDto(updated)
  },

  async remove(actor: RequestUser, id: string): Promise<{ id: string }> {
    const existing = await snippetRepository.findById(id)
    if (!existing) {
      throw new NotFoundError("Snippet not found")
    }

    const userId = await userService.resolveUserId(actor)
    assertIsOwner(existing.owner._id.toString(), userId)

    await runInTransaction(async (session) => {
      await snippetRepository.deleteEngagementBySnippetId(id, session)
      await snippetRepository.deleteById(id, session)
    })

    return { id }
  },
}

async function buildListFilter(
  params: {
    visibility?: "public" | "private"
    ownerId?: string
    language?: string
    tag?: string
    search?: string
    mine?: boolean
  },
  userId: string | null
): Promise<Record<string, unknown>> {
  const filter: Record<string, unknown> = {}

  if (params.mine) {
    if (!userId) {
      throw new ForbiddenError("Authentication required for mine=true")
    }
    filter.owner = userId
  } else if (!userId) {
    filter.visibility = "public"
  } else if (params.visibility) {
    filter.visibility = params.visibility
  } else {
    filter.$or = [{ visibility: "public" }, { owner: userId }]
  }

  if (params.ownerId) {
    filter.owner = params.ownerId
  }

  if (params.language) {
    const languageId = await languageService.resolveLanguageId(params.language)
    filter.language = languageId
  }

  if (params.tag) {
    filter.tags = await tagService.getTagIdByInput(params.tag)
  }

  if (params.search) {
    filter.$or = [
      { name: { $regex: params.search, $options: "i" } },
      { description: { $regex: params.search, $options: "i" } },
    ]
  }

  return filter
}

function assertCanRead(
  visibility: "public" | "private",
  ownerId: string,
  userId: string | null
) {
  if (visibility === "public") return
  if (userId && userId === ownerId) return
  throw new ForbiddenError("You do not have access to this snippet")
}

function assertIsOwner(ownerId: string, userId: string) {
  if (ownerId !== userId) {
    throw new ForbiddenError("Only the snippet owner can perform this action")
  }
}

async function loadEngagementFlags(userId: string, snippetIds: string[]) {
  const [likes, favorites] = await Promise.all([
    likeRepository.findByUserAndSnippets(userId, snippetIds),
    favoriteRepository.findByUserAndSnippets(userId, snippetIds),
  ])

  const liked = new Set(likes.map((l) => l.snippet.toString()))
  const favorited = new Set(favorites.map((f) => f.snippet.toString()))

  const map = new Map<string, { likedByMe: boolean; favoritedByMe: boolean }>()
  for (const id of snippetIds) {
    map.set(id, {
      likedByMe: liked.has(id),
      favoritedByMe: favorited.has(id),
    })
  }
  return map
}
