import { ResourceNotFoundError } from "@/app/use-cases/errors/resource-not-found.error"
import { redirectLink } from "@/app/use-cases/redirect-link"
import { isRight, unwrapEither } from "@/shared/either"
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
          slug: z
            .string()
            .regex(/^[a-zA-Z0-9-]+$/)
            .min(3),
        }),
        response: {
          200: z
            .object({
              originalUrl: z.string().describe("URL to redirect to"),
            })
            .describe("Redirect information"),
          404: z.object({ message: z.string() }).describe("Link not found"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    async (request, reply) => {
      const { referer } = request.headers
      const { slug } = request.params

      const result = await redirectLink({ slug })

      if (isRight(result)) {
        const { originalUrl } = unwrapEither(result)

        const isSwaggerRequest = referer?.includes("/docs")
        if (isSwaggerRequest) {
          return { originalUrl }
        }

        return reply.redirect(originalUrl)
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
