import type { UserDto } from "@/features/users/types/user.types"

interface UserLean {
  _id: { toString(): string }
  auth0Id: string
  name: string
  email: string
  profileImage?: string
  description?: string
  lastLoginAt?: Date | null
  createdAt?: Date
  updatedAt?: Date
}

export function toUserDto(user: UserLean): UserDto {
  return {
    id: user._id.toString(),
    auth0Id: user.auth0Id,
    name: user.name,
    email: user.email,
    profileImage: user.profileImage ?? "",
    description: user.description ?? "",
    lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
    createdAt: user.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: user.updatedAt?.toISOString() ?? new Date().toISOString(),
  }
}
