import { withHandler } from "@/lib/api/handler"
import { tagController } from "@/features/tags/controllers/tag.controller"

export const GET = withHandler((request) => tagController.list(request))

export const POST = withHandler((request) => tagController.create(request))
