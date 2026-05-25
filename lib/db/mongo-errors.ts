export function isMongoDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: number }).code === 11000
  )
}

export function isValidObjectId(id: string): boolean {
  return /^[a-f\d]{24}$/i.test(id)
}
