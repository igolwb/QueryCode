export interface SnippetOwnerDto {
  id: string
  name: string
  profileImage: string
}

export interface SnippetDto {
  id: string
  name: string
  code: string
  description: string
  visibility: "public" | "private"
  language: string
  tags: string[]
  owner: SnippetOwnerDto
  likesCount: number
  favoritesCount: number
  likedByMe?: boolean
  favoritedByMe?: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateSnippetInput {
  name: string
  code: string
  description?: string
  visibility?: "public" | "private"
  language: string
  tags: string[]
}

export interface UpdateSnippetInput {
  name?: string
  code?: string
  description?: string
  visibility?: "public" | "private"
  language?: string
  tags?: string[]
}
