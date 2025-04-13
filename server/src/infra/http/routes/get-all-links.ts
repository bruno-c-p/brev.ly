import { getAllLinks } from "@/app/use-cases/get-all-links"
import { unwrapEither } from "@/infra/shared/either"
import { internalErrorSchema, linkResponseSchema } from "@/infra/shared/schemas"
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
          200: z.array(linkResponseSchema).describe("List of links"),
          500: internalErrorSchema,
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
