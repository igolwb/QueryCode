import { languageRepository } from "@/features/languages/repositories/language.repository"
import { toLanguageDto } from "@/features/languages/utils/language.mapper"
import type { LanguageDto } from "@/features/languages/types/language.types"
import { buildPaginationMeta, getSkip } from "@/lib/api/pagination"
import type { PaginatedResult } from "@/types/api"
import { toSlug } from "@/utils/slug"
import { ConflictError, NotFoundError } from "@/lib/api/errors"

export const languageService = {
  async list(params: {
    page: number
    limit: number
    search?: string
  }): Promise<PaginatedResult<LanguageDto>> {
    const filter = params.search
      ? {
          $or: [
            { name: { $regex: params.search, $options: "i" } },
            { slug: { $regex: toSlug(params.search), $options: "i" } },
          ],
        }
      : {}

    const skip = getSkip(params.page, params.limit)
    const [items, total] = await Promise.all([
      languageRepository.findMany(filter, skip, params.limit),
      languageRepository.count(filter),
    ])

    return {
      items: items.map(toLanguageDto),
      meta: buildPaginationMeta(total, params.page, params.limit),
    }
  },

  async create(name: string): Promise<LanguageDto> {
    const slug = toSlug(name)
    if (!slug) {
      throw new ConflictError("Language name cannot produce a valid slug")
    }

    const existing = await languageRepository.findBySlug(slug)
    if (existing) {
      throw new ConflictError(`Language with slug "${slug}" already exists`)
    }

    const language = await languageRepository.create(name, slug)
    return toLanguageDto(language.toObject())
  },

  async resolveLanguageId(input: string): Promise<string> {
    const slug = toSlug(input)
    const language = await languageRepository.findBySlug(slug)
    if (!language) {
      throw new NotFoundError(`Language "${slug}" not found`)
    }
    return language._id.toString()
  },
}
