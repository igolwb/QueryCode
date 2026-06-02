import type { NextRequest } from "next/server"
import { auth0 } from "@/lib/auth0"
import { UnauthorizedError } from "@/lib/api/errors"
import { isValidObjectId } from "@/lib/db/mongo-errors"
import { resolveRequestUserFromAuth0 } from "@/lib/auth/session-user"
import type { RequestUser } from "@/lib/auth/types"

const USER_ID_HEADER = "x-user-id"
const AUTH0_SUB_HEADER = "x-auth0-sub"

/**
 * Resolves the authenticated user from Auth0 session (primary) or dev headers (Postman).
 */
export async function getRequestUser(
  request: NextRequest,
): Promise<RequestUser | null> {
  const session = await auth0.getSession(request)
  if (session?.user) {
    return resolveRequestUserFromAuth0(session.user)
  }

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

export async function requireRequestUser(
  request: NextRequest,
): Promise<RequestUser> {
  const user = await getRequestUser(request)
  if (!user) {
    throw new UnauthorizedError(
      "Authentication required. Log in via /auth/login or provide x-user-id / x-auth0-sub for API testing.",
    )
  }
  return user
}
