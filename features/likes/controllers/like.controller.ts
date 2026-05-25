import type { NextRequest } from "next/server"
import { requireRequestUser } from "@/lib/auth/context"
import { parseParams } from "@/lib/api/parse"
import { successResponse } from "@/lib/api/response"
import { snippetIdParamSchema } from "@/features/snippets/validations/snippet.validation"
import { likeService } from "@/features/likes/services/like.service"

export const likeController = {
  async add(
    request: NextRequest,
    context: { params: Promise<Record<string, string | string[] | undefined>> }
  ) {
    const actor = requireRequestUser(request)
    const { id } = parseParams(await context.params, snippetIdParamSchema)
    const result = await likeService.add(actor, id)
    return successResponse(result, 201)
  },

  async remove(
    request: NextRequest,
    context: { params: Promise<Record<string, string | string[] | undefined>> }
  ) {
    const actor = requireRequestUser(request)
    const { id } = parseParams(await context.params, snippetIdParamSchema)
    const result = await likeService.remove(actor, id)
    return successResponse(result)
  },
}
