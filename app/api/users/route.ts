import { withHandler } from "@/lib/api/handler"
import { userController } from "@/features/users/controllers/user.controller"

/** Auth0 login callback / user sync */
export const POST = withHandler((request) => userController.sync(request))
