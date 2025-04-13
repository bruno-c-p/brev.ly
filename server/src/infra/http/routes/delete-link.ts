import { deleteLink } from "@/app/use-cases/delete-link"
import { ResourceNotFoundError } from "@/app/use-cases/errors/resource-not-found.error"
import { isRight, unwrapEither } from "@/shared/either"
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

export const deleteLinkRoute: FastifyPluginAsyncZod = async server => {
  server.delete(
    "/links/:slug",
    {
      schema: {
        tags: ["Links"],
        summary: "Delete a link",
        params: z.object({
          slug: z
            .string()
            .regex(
              /^[a-zA-Z0-9-]+$/,
              "A URL encurtada deve conter apenas letras, números e hífen"
            )
            .min(3, "A URL encurtada deve ter pelo menos 3 caracteres"),
        }),
        response: {
          204: z.undefined().describe("Link deleted successfully"),
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
            .describe("Invalid request params"),
          404: z
            .object({ message: z.string() })
            .describe("Shortened URL not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params

      const result = await deleteLink({ slug })

      if (isRight(result)) {
        return reply.status(204).send()
      }

      const error = unwrapEither(result)
      switch (error.name) {
        case ResourceNotFoundError.name:
          return reply.status(404).send({ message: error.message })
        default:
          throw new Error("Internal server error")
      }
    }
  )
}
