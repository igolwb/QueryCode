import { z } from "zod"
import { paginationQuerySchema } from "@/lib/api/pagination"

export const listTagsQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().optional(),
})

export const createTagBodySchema = z.object({
  name: z.string().trim().min(1).max(50),
})

export const resolveTagsBodySchema = z.object({
  tags: z.array(z.string().trim().min(1)).min(1),
})
