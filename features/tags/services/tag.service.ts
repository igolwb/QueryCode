import { tagRepository } from "@/features/tags/repositories/tag.repository"
import { toTagDto } from "@/features/tags/utils/tag.mapper"
import type { TagDto } from "@/features/tags/types/tag.types"
import { buildPaginationMeta, getSkip } from "@/lib/api/pagination"
import type { PaginatedResult } from "@/types/api"
import { toSlug } from "@/utils/slug"
import { ConflictError, NotFoundError } from "@/lib/api/errors"

export const tagService = {
  async list(params: {
    page: number
    limit: number
    search?: string
  }): Promise<PaginatedResult<TagDto>> {
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
      tagRepository.findMany(filter, skip, params.limit),
      tagRepository.count(filter),
    ])

    return {
      items: items.map(toTagDto),
      meta: buildPaginationMeta(total, params.page, params.limit),
    }
  },

  async create(name: string): Promise<TagDto> {
    const slug = toSlug(name)
    if (!slug) {
      throw new ConflictError("Tag name cannot produce a valid slug")
    }

    const existing = await tagRepository.findBySlug(slug)
    if (existing) {
      throw new ConflictError(`Tag with slug "${slug}" already exists`)
    }

    const tag = await tagRepository.create(name, slug)
    return toTagDto(tag.toObject())
  },

  /**
   * Resolve client tag names/slugs to Tag documents (find-or-create).
   */
  async getTagIdByInput(input: string): Promise<string> {
    const slug = toSlug(input)
    const tag = await tagRepository.findBySlug(slug)
    if (!tag) {
      throw new NotFoundError(`Tag "${slug}" not found`)
    }
    return tag._id.toString()
  },

  async resolveTagIds(inputs: string[]): Promise<string[]> {
    const slugs = [
      ...new Set(inputs.map((input) => toSlug(input)).filter(Boolean)),
    ]
    if (slugs.length === 0) {
      throw new ConflictError("At least one valid tag is required")
    }

    const existing = await tagRepository.findBySlugs(slugs)
    const existingBySlug = new Map(existing.map((t) => [t.slug, t]))

    const ids: string[] = []

    for (const slug of slugs) {
      const found = existingBySlug.get(slug)
      if (found) {
        ids.push(found._id.toString())
        continue
      }

      const name = inputs.find((i) => toSlug(i) === slug) ?? slug
      try {
        const created = await tagRepository.create(name, slug)
        ids.push(created._id.toString())
      } catch {
        const retry = await tagRepository.findBySlug(slug)
        if (!retry) throw new ConflictError(`Failed to resolve tag "${slug}"`)
        ids.push(retry._id.toString())
      }
    }

    return ids
  },
}
