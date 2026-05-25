import type { NextRequest } from "next/server"
import { getRequestUser, requireRequestUser } from "@/lib/auth/context"
import { parseJsonBody, parseParams, parseQuery } from "@/lib/api/parse"
import { successResponse } from "@/lib/api/response"
import {
  createSnippetBodySchema,
  listSnippetsQuerySchema,
  snippetIdParamSchema,
  updateSnippetBodySchema,
} from "@/features/snippets/validations/snippet.validation"
import { snippetService } from "@/features/snippets/services/snippet.service"

export const snippetController = {
  async list(request: NextRequest) {
    const query = parseQuery(request, listSnippetsQuerySchema)
    const actor = getRequestUser(request)
    const result = await snippetService.list(actor, query)
    return successResponse(result)
  },

  async create(request: NextRequest) {
    const actor = requireRequestUser(request)
    const body = await parseJsonBody(request, createSnippetBodySchema)
    const snippet = await snippetService.create(actor, body)
    return successResponse(snippet, 201)
  },

  async getById(
    request: NextRequest,
    context: { params: Promise<Record<string, string | string[] | undefined>> }
  ) {
    const { id } = parseParams(await context.params, snippetIdParamSchema)
    const actor = getRequestUser(request)
    const snippet = await snippetService.getById(actor, id)
    return successResponse(snippet)
  },

  async update(
    request: NextRequest,
    context: { params: Promise<Record<string, string | string[] | undefined>> }
  ) {
    const actor = requireRequestUser(request)
    const { id } = parseParams(await context.params, snippetIdParamSchema)
    const body = await parseJsonBody(request, updateSnippetBodySchema)
    const snippet = await snippetService.update(actor, id, body)
    return successResponse(snippet)
  },

  async remove(
    request: NextRequest,
    context: { params: Promise<Record<string, string | string[] | undefined>> }
  ) {
    const actor = requireRequestUser(request)
    const { id } = parseParams(await context.params, snippetIdParamSchema)
    const result = await snippetService.remove(actor, id)
    return successResponse(result)
  },
}
