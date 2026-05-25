import { toLanguageDto } from "@/features/languages/utils/language.mapper"
import { toTagDto } from "@/features/tags/utils/tag.mapper"
import type { SnippetDto } from "@/features/snippets/types/snippet.types"

interface PopulatedLean {
  _id: { toString(): string }
  name: string
  code: string
  description?: string
  visibility: "public" | "private"
  likesCount: number
  favoritesCount: number
  createdAt?: Date
  updatedAt?: Date
  language: {
    _id: { toString(): string }
    name: string
    slug: string
    createdAt?: Date
    updatedAt?: Date
  }
  tags: Array<{
    _id: { toString(): string }
    name: string
    slug: string
    createdAt?: Date
    updatedAt?: Date
  }>
  owner: {
    _id: { toString(): string }
    name: string
    profileImage?: string
  }
}

export function toSnippetDto(
  snippet: PopulatedLean,
  engagement?: { likedByMe?: boolean; favoritedByMe?: boolean }
): SnippetDto {
  return {
    id: snippet._id.toString(),
    name: snippet.name,
    code: snippet.code,
    description: snippet.description ?? "",
    visibility: snippet.visibility,
    language: toLanguageDto(snippet.language),
    tags: snippet.tags.map(toTagDto),
    owner: {
      id: snippet.owner._id.toString(),
      name: snippet.owner.name,
      profileImage: snippet.owner.profileImage ?? "",
    },
    likesCount: snippet.likesCount,
    favoritesCount: snippet.favoritesCount,
    ...(engagement?.likedByMe !== undefined
      ? { likedByMe: engagement.likedByMe }
      : {}),
    ...(engagement?.favoritedByMe !== undefined
      ? { favoritedByMe: engagement.favoritedByMe }
      : {}),
    createdAt: snippet.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: snippet.updatedAt?.toISOString() ?? new Date().toISOString(),
  }
}
