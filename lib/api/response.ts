import { NextResponse } from "next/server"
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/api"
import { AppError, InternalServerError } from "@/lib/api/errors"
import { isMongoDuplicateKeyError } from "@/lib/db/mongo-errors"
import { ZodError } from "zod"

export function successResponse<T>(
  data: T,
  status = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({ success: true, data }, { status })
}

export function errorResponse(error: AppError): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        ...(error.details !== undefined ? { details: error.details } : {}),
      },
    },
    { status: error.statusCode }
  )
}

export function handleUnknownError(
  error: unknown
): NextResponse<ApiErrorResponse> {
  if (error instanceof AppError) {
    return errorResponse(error)
  }

  if (error instanceof ZodError) {
    return errorResponse(
      new AppError(
        "Validation failed",
        400,
        "VALIDATION_ERROR",
        error.flatten()
      )
    )
  }

  if (isMongoDuplicateKeyError(error)) {
    return errorResponse(
      new AppError("Resource already exists", 409, "DUPLICATE_KEY")
    )
  }

  console.error("[api]", error)
  return errorResponse(new InternalServerError())
}
