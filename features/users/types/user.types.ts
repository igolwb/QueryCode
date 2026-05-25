export interface UserDto {
  id: string
  auth0Id: string
  name: string
  email: string
  profileImage: string
  description: string
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}
