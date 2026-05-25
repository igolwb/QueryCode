import type { NextRequest } from "next/server"
import { parseJsonBody, parseQuery } from "@/lib/api/parse"
import { successResponse } from "@/lib/api/response"
import {
  createTagBodySchema,
  listTagsQuerySchema,
} from "@/features/tags/validations/tag.validation"
import { tagService } from "@/features/tags/services/tag.service"

export const tagController = {
  async list(request: NextRequest) {
    const query = parseQuery(request, listTagsQuerySchema)
    const result = await tagService.list(query)
    return successResponse(result)
  },

  async create(request: NextRequest) {
    const body = await parseJsonBody(request, createTagBodySchema)
    const tag = await tagService.create(body.name)
    return successResponse(tag, 201)
  },
}
