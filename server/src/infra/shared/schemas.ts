import { z } from "zod"

export const slugSchema = z
  .string()
  .regex(
    /^[a-zA-Z0-9-]+$/,
    "A URL encurtada deve conter apenas letras, números e hífen."
  )
  .min(3, "A URL encurtada deve ter pelo menos 3 caracteres.")
  .describe("The shortened URL should have only letters, numbers and hyphen.")

export const urlSchema = z.string().url("URL inválida.")

export const createLinkSchema = z.object({
  originalUrl: urlSchema,
  slug: slugSchema,
})

export const deleteLinkSchema = z.object({
  slug: slugSchema,
})

export const redirectLinkSchema = z.object({
  slug: slugSchema,
})

export const linkResponseSchema = z.object({
  originalUrl: z.string(),
  slug: z.string(),
  visits: z.number(),
})

export const validationErrorSchema = z
  .object({
    message: z.string(),
    issues: z.array(
      z.object({
        field: z.string(),
        message: z.string(),
      })
    ),
  })
  .describe("Validation error")

export const notFoundErrorSchema = z
  .object({ message: z.string() })
  .describe("Resource not found")

export const conflictErrorSchema = z
  .object({ message: z.string() })
  .describe("Resource already exists")

export const internalErrorSchema = z
  .object({ message: z.string() })
  .describe("Internal server error")
