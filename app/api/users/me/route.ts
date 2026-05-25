import { withHandler } from "@/lib/api/handler"
import { userController } from "@/features/users/controllers/user.controller"

export const GET = withHandler((request) => userController.getMe(request))

export const PATCH = withHandler((request) => userController.updateMe(request))
