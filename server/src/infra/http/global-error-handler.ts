import type { FastifyError, FastifyReply, FastifyRequest } from "fastify"
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
} from "fastify-type-provider-zod"

export function globalErrorHandler(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply
) {
  if (hasZodFastifySchemaValidationErrors(error)) {
    const issues = error.validation.map(issue => ({
      field: issue.instancePath.substring(1),
      message: issue.message,
    }))
    return reply.status(400).send({
      message: "Validation error.",
      issues,
    })
  }
  if (isResponseSerializationError(error)) {
    return reply.code(500).send({
      error: "Internal Server Error",
      message: "Response doesn't match the schema",
      statusCode: 500,
      details: {
        issues: error.cause.issues,
        method: error.method,
        url: error.url,
      },
    })
  }
  console.error(error)
  return reply.status(500).send({ message: "Internal server error." })
}
