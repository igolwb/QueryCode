export interface ApiSuccessResponse<T> {
  success: true
  data: T
}

export interface ApiErrorBody {
  message: string
  code: string
  details?: unknown
}

export interface ApiErrorResponse {
  success: false
  error: ApiErrorBody
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface PaginatedResult<T> {
  items: T[]
  meta: PaginationMeta
}
