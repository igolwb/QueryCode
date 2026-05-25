import { z } from "zod"
import { paginationQuerySchema } from "@/lib/api/pagination"

export const listLanguagesQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().optional(),
})

export const createLanguageBodySchema = z.object({
  name: z.string().trim().min(1).max(50),
})

export const languageSlugParamSchema = z.object({
  slug: z.string().trim().min(1),
})
