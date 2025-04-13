import { createLink } from "@/app/use-cases/create-link"
import { ResourceAlreadyExistsError } from "@/app/use-cases/errors/resource-already-exists.error"
import { isRight, unwrapEither } from "@/infra/shared/either"
import {
  conflictErrorSchema,
  createLinkSchema,
  internalErrorSchema,
  linkResponseSchema,
  validationErrorSchema,
} from "@/infra/shared/schemas"
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"

export const createLinkRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    "/links",
    {
      schema: {
        tags: ["Links"],
        summary: "Create a new link",
        body: createLinkSchema,
        response: {
          201: linkResponseSchema.describe("Created link"),
          400: validationErrorSchema,
          409: conflictErrorSchema,
          500: internalErrorSchema,
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
