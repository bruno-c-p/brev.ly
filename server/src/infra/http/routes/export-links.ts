import { exportLinks } from "@/app/use-cases/export-links"
import { unwrapEither } from "@/infra/shared/either"
import { internalErrorSchema, linkResponseSchema } from "@/infra/shared/schemas"
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

export const exportLinksRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    "/links/export",
    {
      schema: {
        tags: ["Links"],
        summary: "Export all links",
        response: {
          200: z.object({
            reportUrl: z.string().describe("URL to download the report"),
          }),
          500: internalErrorSchema,
        },
      },
    },
    async (_request, reply) => {
      const result = await exportLinks()

      const { reportUrl } = unwrapEither(result)

      return reply.status(200).send({ reportUrl })
    }
  )
}
