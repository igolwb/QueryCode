import { userRepository } from "@/features/users/repositories/user.repository"
import { toUserDto } from "@/features/users/utils/user.mapper"
import type { UserDto } from "@/features/users/types/user.types"
import type { RequestUser } from "@/lib/auth/types"
import { NotFoundError } from "@/lib/api/errors"

export const userService = {
  async syncUser(input: {
    auth0Id: string
    email: string
    name: string
    profileImage?: string
  }): Promise<UserDto> {
    const user = await userRepository.upsertByAuth0Id(input)
    if (!user) {
      throw new NotFoundError("Failed to sync user")
    }
    return toUserDto(user)
  },

  async getMe(actor: RequestUser): Promise<UserDto> {
    const user = actor.id
      ? await userRepository.findById(actor.id)
      : actor.auth0Id
        ? await userRepository.findByAuth0Id(actor.auth0Id)
        : null

    if (!user) {
      throw new NotFoundError("User not found")
    }
    return toUserDto(user)
  },

  async updateMe(
    actor: RequestUser,
    data: { name?: string; profileImage?: string; description?: string }
  ): Promise<UserDto> {
    const userId = await resolveUserId(actor)
    const user = await userRepository.updateById(userId, data)
    if (!user) {
      throw new NotFoundError("User not found")
    }
    return toUserDto(user)
  },

  async resolveUserId(actor: RequestUser): Promise<string> {
    return resolveUserId(actor)
  },
}

async function resolveUserId(actor: RequestUser): Promise<string> {
  if (actor.id) {
    return actor.id
  }
  if (actor.auth0Id) {
    const user = await userRepository.findByAuth0Id(actor.auth0Id)
    if (!user) {
      throw new NotFoundError("User not found for auth0 subject")
    }
    return user._id.toString()
  }
  throw new NotFoundError("User not found")
}
