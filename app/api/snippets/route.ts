import { withHandler } from "@/lib/api/handler"
import { snippetController } from "@/features/snippets/controllers/snippet.controller"

export const GET = withHandler((request) => snippetController.list(request))

export const POST = withHandler((request) => snippetController.create(request))
