import type { NextRequest } from "next/server"
import { UnauthorizedError } from "@/lib/api/errors"
import { isValidObjectId } from "@/lib/db/mongo-errors"
import type { RequestUser } from "@/lib/auth/types"

const USER_ID_HEADER = "x-user-id"
const AUTH0_SUB_HEADER = "x-auth0-sub"

/**
 * Resolves the authenticated user from request headers.
 * Swap this implementation when Auth0 middleware is added — controllers stay unchanged.
 */
export function getRequestUser(request: NextRequest): RequestUser | null {
  const userId = request.headers.get(USER_ID_HEADER)
  if (userId && isValidObjectId(userId)) {
    return { id: userId }
  }

  const auth0Sub = request.headers.get(AUTH0_SUB_HEADER)
  if (auth0Sub) {
    return { auth0Id: auth0Sub }
  }

  return null
}

export function requireRequestUser(request: NextRequest): RequestUser {
  const user = getRequestUser(request)
  if (!user) {
    throw new UnauthorizedError(
      "Authentication required. Provide x-user-id (MongoDB ObjectId) or x-auth0-sub."
    )
  }
  return user
}
