import { z } from "zod"

export const syncUserBodySchema = z.object({
  auth0Id: z.string().trim().min(1),
  email: z.string().email(),
  name: z.string().trim().min(1).max(20),
  profileImage: z.string().url().optional().or(z.literal("")),
})

export const updateUserBodySchema = z
  .object({
    name: z.string().trim().min(1).max(20).optional(),
    profileImage: z.string().url().optional().or(z.literal("")),
    description: z.string().max(200).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  })
