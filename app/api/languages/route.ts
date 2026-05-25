import { withHandler } from "@/lib/api/handler"
import { languageController } from "@/features/languages/controllers/language.controller"

export const GET = withHandler((request) => languageController.list(request))

export const POST = withHandler((request) => languageController.create(request))
