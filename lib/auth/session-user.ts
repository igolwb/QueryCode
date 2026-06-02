import type { User as Auth0User } from "@auth0/nextjs-auth0/types"
import { userService } from "@/features/users/services/user.service"
import type { RequestUser } from "@/lib/auth/types"
import { UnauthorizedError } from "@/lib/api/errors"

export async function resolveRequestUserFromAuth0(
  auth0User: Auth0User,
): Promise<RequestUser> {
  const sub = auth0User.sub
  const email = auth0User.email

  if (!sub || !email) {
    throw new UnauthorizedError(
      "Auth0 profile must include sub and email. Configure your Auth0 application accordingly.",
    )
  }

  const name = (auth0User.name ?? auth0User.nickname ?? "User").trim().slice(0, 20)

  const user = await userService.syncUser({
    auth0Id: sub,
    email,
    name: name.length > 0 ? name : "User",
    profileImage: auth0User.picture,
  })

  return { id: user.id, auth0Id: user.auth0Id }
}
