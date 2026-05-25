import type { NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { handleUnknownError } from "@/lib/api/response"

type RouteContext = {
  params: Promise<Record<string, string | string[] | undefined>>
}

type RouteHandler = (
  request: NextRequest,
  context: RouteContext
) => Promise<Response>

/**
 * Wraps App Router handlers: connects DB once, centralizes error → JSON mapping.
 */
export function withHandler(handler: RouteHandler): RouteHandler {
  return async (request, context) => {
    try {
      await connectDB()
      return await handler(request, context)
    } catch (error) {
      return handleUnknownError(error)
    }
  }
}
