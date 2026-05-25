import { withHandler } from "@/lib/api/handler"
import { snippetController } from "@/features/snippets/controllers/snippet.controller"

export const GET = withHandler((request, context) =>
  snippetController.getById(request, context)
)

export const PATCH = withHandler((request, context) =>
  snippetController.update(request, context)
)

export const DELETE = withHandler((request, context) =>
  snippetController.remove(request, context)
)
