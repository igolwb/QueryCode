import type { TagDto } from "@/features/tags/types/tag.types"

interface TagLean {
  _id: { toString(): string }
  name: string
  slug: string
  createdAt?: Date
  updatedAt?: Date
}

export function toTagDto(tag: TagLean): TagDto {
  return {
    id: tag._id.toString(),
    name: tag.name,
    slug: tag.slug,
    createdAt: tag.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: tag.updatedAt?.toISOString() ?? new Date().toISOString(),
  }
}
