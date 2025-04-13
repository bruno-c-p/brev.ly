import { createLink } from "@/app/use-cases/create-link"
import { ResourceAlreadyExistsError } from "@/app/use-cases/errors/resource-already-exists.error"
import { isRight, unwrapEither } from "@/shared/either"
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

export const createLinkRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    "/links",
    {
      schema: {
        tags: ["Links"],
        summary: "Create a new link",
        body: z.object({
          originalUrl: z.string().url("URL inválida"),
          slug: z
            .string()
            .regex(
              /^[a-zA-Z0-9-]+$/,
              "A URL encurtada deve conter apenas letras, números e hífen"
            )
            .min(3, "A URL encurtada deve ter pelo menos 3 caracteres"),
        }),
        response: {
          201: z
            .object({
              originalUrl: z.string(),
              slug: z.string(),
              visits: z.number(),
            })
            .describe("Created link"),
          400: z
            .object({
              message: z.string(),
              issues: z.array(
                z.object({
                  field: z.string(),
                  message: z.string(),
                })
              ),
            })
            .describe("Invalid request body"),
          409: z
            .object({ message: z.string() })
            .describe("Shortened URL already exists"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    async (request, reply) => {
      const { originalUrl, slug } = request.body

      const result = await createLink({ originalUrl, slug })

      if (isRight(result)) {
        const { link } = unwrapEither(result)
        return reply.status(201).send(link)
      }

      const error = unwrapEither(result)
      switch (error.name) {
        case ResourceAlreadyExistsError.name:
          return reply.status(409).send({ message: error.message })
        default:
          throw new Error("Internal server error")
      }
    }
  )
}
