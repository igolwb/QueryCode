import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI")
}

const uri: string = MONGODB_URI

/**
 * Mongoose connection cache type
 */
interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

/**
 * Extend NodeJS global type
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined
}

/**
 * Use global cache to prevent multiple connections
 * in development (Next.js hot reload issue)
 */
const cached: MongooseCache = global.mongoose ?? {
  conn: null,
  promise: null,
}

if (!global.mongoose) {
  global.mongoose = cached
}

/**
 * Connect to MongoDB
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri)
  }

  cached.conn = await cached.promise
  return cached.conn
}
