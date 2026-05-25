import { withHandler } from "@/lib/api/handler"
import { likeController } from "@/features/likes/controllers/like.controller"

export const POST = withHandler((request, context) =>
  likeController.add(request, context)
)

export const DELETE = withHandler((request, context) =>
  likeController.remove(request, context)
)
