import type { NextRequest } from "next/server"
import { z, type ZodType } from "zod"
import { BadRequestError } from "@/lib/api/errors"

export async function parseJsonBody<T extends ZodType>(
  request: NextRequest,
  schema: T
): Promise<z.infer<T>> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    throw new BadRequestError("Invalid JSON body")
  }

  return schema.parse(body)
}

export function parseQuery<T extends ZodType>(
  request: NextRequest,
  schema: T
): z.infer<T> {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries())
  return schema.parse(params)
}

export function parseParams<T extends ZodType>(
  params: Record<string, string | string[] | undefined>,
  schema: T
): z.infer<T> {
  const normalized = Object.fromEntries(
    Object.entries(params).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ])
  )
  return schema.parse(normalized)
}
