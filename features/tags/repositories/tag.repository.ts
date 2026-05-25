import { Tag } from "@/models/tags"

export const tagRepository = {
  findBySlug(slug: string) {
    return Tag.findOne({ slug }).lean()
  },

  findBySlugs(slugs: string[]) {
    return Tag.find({ slug: { $in: slugs } }).lean()
  },

  create(name: string, slug: string) {
    return Tag.create({ name, slug })
  },

  findMany(filter: Record<string, unknown>, skip: number, limit: number) {
    return Tag.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean()
  },

  count(filter: Record<string, unknown>) {
    return Tag.countDocuments(filter)
  },
}
