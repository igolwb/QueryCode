import type { NextRequest } from "next/server"
import { parseJsonBody, parseQuery } from "@/lib/api/parse"
import { successResponse } from "@/lib/api/response"
import {
  createLanguageBodySchema,
  listLanguagesQuerySchema,
} from "@/features/languages/validations/language.validation"
import { languageService } from "@/features/languages/services/language.service"

export const languageController = {
  async list(request: NextRequest) {
    const query = parseQuery(request, listLanguagesQuerySchema)
    const result = await languageService.list(query)
    return successResponse(result)
  },

  async create(request: NextRequest) {
    const body = await parseJsonBody(request, createLanguageBodySchema)
    const language = await languageService.create(body.name)
    return successResponse(language, 201)
  },
}
