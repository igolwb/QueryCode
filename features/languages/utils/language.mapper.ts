import type { LanguageDto } from "@/features/languages/types/language.types"

interface LanguageLean {
  _id: { toString(): string }
  name: string
  slug: string
  createdAt?: Date
  updatedAt?: Date
}

export function toLanguageDto(language: LanguageLean): LanguageDto {
  return {
    id: language._id.toString(),
    name: language.name,
    slug: language.slug,
    createdAt: language.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: language.updatedAt?.toISOString() ?? new Date().toISOString(),
  }
}
