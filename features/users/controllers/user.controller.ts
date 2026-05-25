import type { NextRequest } from "next/server"
import { requireRequestUser } from "@/lib/auth/context"
import { parseJsonBody } from "@/lib/api/parse"
import { successResponse } from "@/lib/api/response"
import {
  syncUserBodySchema,
  updateUserBodySchema,
} from "@/features/users/validations/user.validation"
import { userService } from "@/features/users/services/user.service"

export const userController = {
  async sync(request: NextRequest) {
    const body = await parseJsonBody(request, syncUserBodySchema)
    const user = await userService.syncUser(body)
    return successResponse(user, 201)
  },

  async getMe(request: NextRequest) {
    const actor = requireRequestUser(request)
    const user = await userService.getMe(actor)
    return successResponse(user)
  },

  async updateMe(request: NextRequest) {
    const actor = requireRequestUser(request)
    const body = await parseJsonBody(request, updateUserBodySchema)
    const user = await userService.updateMe(actor, body)
    return successResponse(user)
  },
}
