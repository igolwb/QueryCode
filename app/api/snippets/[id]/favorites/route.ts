import { withHandler } from "@/lib/api/handler"
import { favoriteController } from "@/features/favorites/controllers/favorite.controller"

export const POST = withHandler((request, context) =>
  favoriteController.add(request, context)
)

export const DELETE = withHandler((request, context) =>
  favoriteController.remove(request, context)
)
