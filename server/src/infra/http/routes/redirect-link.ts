import { ResourceNotFoundError } from "@/app/use-cases/errors/resource-not-found.error"
import { redirectLink } from "@/app/use-cases/redirect-link"
import { isRight, unwrapEither } from "@/infra/shared/either"
import {
  internalErrorSchema,
  notFoundErrorSchema,
  slugSchema,
} from "@/infra/shared/schemas"
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

export const redirectLinkRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    "/:slug",
    {
      schema: {
        tags: ["Links"],
        summary: "Redirect link to original URL",
        params: z.object({
          slug: slugSchema,
        }),
        response: {
          200: z
            .object({
              originalUrl: z.string().describe("URL to redirect to"),
            })
            .describe("Redirect information"),
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
          404: notFoundErrorSchema.describe("Link not found"),
          500: internalErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params

      const result = await redirectLink({ slug })

      if (isRight(result)) {
        const { originalUrl } = unwrapEither(result)
        return {
          originalUrl,
        }
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
