import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

export const createLinkRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    "/links",
    {
      schema: {
        summary: "Create a new link",
        body: z.object({
          originalUrl: z.string().url(),
          shortenedUrl: z
            .string()
            .regex(/^[a-zA-Z0-9-]+$/)
            .min(3),
        }),
        response: {
          201: z.object({
            originalUrl: z.string(),
            shortenedUrl: z.string(),
            visits: z.number(),
          }),
          409: z
            .object({ message: z.string() })
            .describe("Shortened URL already exists"),
        },
        500: z
          .object({ message: z.string() })
          .describe("Internal server error"),
      },
    },
    async (request, reply) => {
      const { originalUrl, shortenedUrl } = request.body

      return reply.status(201).send({
        originalUrl,
        shortenedUrl,
        visits: 0,
      })
    }
  )
}
