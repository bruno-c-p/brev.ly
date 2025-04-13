import { getAllLinks } from "@/app/use-cases/get-all-links"
import { isRight, unwrapEither } from "@/shared/either"
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

export const getAllLinksRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    "/links",
    {
      schema: {
        tags: ["Links"],
        summary: "Get all links",
        response: {
          200: z
            .array(
              z.object({
                originalUrl: z.string(),
                slug: z.string(),
                visits: z.number(),
              })
            )
            .describe("List of links"),
          500: z
            .object({ message: z.string() })
            .describe("Internal server error"),
        },
      },
    },
    async (_request, reply) => {
      const result = await getAllLinks()

      const { links } = unwrapEither(result)

      return reply.status(200).send(links)
    }
  )
}
