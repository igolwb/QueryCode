import { z } from "zod"
import { paginationQuerySchema } from "@/lib/api/pagination"
import { languages } from "@/data/languages"
import { tags } from "@/data/tags"

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id")

const languageSlugs = new Set<string>(languages.map((l) => l.slug as string))
const tagSlugs = new Set<string>(tags.map((t) => t.slug as string))

export const snippetIdParamSchema = z.object({
  id: objectIdSchema,
})

export const listSnippetsQuerySchema = paginationQuerySchema.extend({
  visibility: z.enum(["public", "private"]).optional(),
  ownerId: objectIdSchema.optional(),
  language: z
    .string()
    .trim()
    .optional()
    .refine((v) => v === undefined || languageSlugs.has(v), {
      message: "Language not found",
    }),
  tag: z
    .string()
    .trim()
    .optional()
    .refine((v) => v === undefined || tagSlugs.has(v), {
      message: "Tag not found",
    }),
  search: z.string().trim().optional(),
  mine: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => v === "true"),
})

const snippetBodyFields = {
  name: z.string().trim().min(1).max(20),
  code: z.string().min(1).max(10000),
  description: z.string().max(500).optional(),
  visibility: z.enum(["public", "private"]).optional(),
  language: z.string().trim().min(1).refine((s) => languageSlugs.has(s), {
    message: "Language not found",
  }),
  tags: z
    .array(z.string().trim().min(1))
    .min(1)
    .refine((arr) => arr.every((s) => tagSlugs.has(s)), {
      message: "One or more tags are invalid",
    }),
}

export const createSnippetBodySchema = z.object(snippetBodyFields)

export const updateSnippetBodySchema = z
  .object({
    name: snippetBodyFields.name.optional(),
    code: snippetBodyFields.code.optional(),
    description: snippetBodyFields.description,
    visibility: snippetBodyFields.visibility,
    language: snippetBodyFields.language.optional(),
    tags: snippetBodyFields.tags.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  })
