import { Language } from "@/models/languages"

export const languageRepository = {
  findBySlug(slug: string) {
    return Language.findOne({ slug }).lean()
  },

  create(name: string, slug: string) {
    return Language.create({ name, slug })
  },

  findMany(filter: Record<string, unknown>, skip: number, limit: number) {
    return Language.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean()
  },

  count(filter: Record<string, unknown>) {
    return Language.countDocuments(filter)
  },
}
