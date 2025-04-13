import { deleteLink } from "@/app/use-cases/delete-link"
import { ResourceNotFoundError } from "@/app/use-cases/errors/resource-not-found.error"
import { isRight, unwrapEither } from "@/shared/either"
import {
  deleteLinkSchema,
  internalErrorSchema,
  notFoundErrorSchema,
  validationErrorSchema,
} from "@/shared/schemas"
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

export const deleteLinkRoute: FastifyPluginAsyncZod = async server => {
  server.delete(
    "/links/:slug",
    {
      schema: {
        tags: ["Links"],
        summary: "Delete a link",
        params: deleteLinkSchema,
        response: {
          204: z.undefined().describe("Link deleted successfully"),
          400: validationErrorSchema.describe("Invalid request params"),
          404: notFoundErrorSchema,
          500: internalErrorSchema,
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
