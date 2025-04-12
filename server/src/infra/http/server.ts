import { env } from "@/env"
import { fastifyCors } from "@fastify/cors"
import { fastifySwagger } from "@fastify/swagger"
import { fastifySwaggerUi } from "@fastify/swagger-ui"
import { fastify } from "fastify"
import {
  hasZodFastifySchemaValidationErrors,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod"
import { createLinkRoute } from "./routes/create-link"

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error, _request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    const issues = error.validation.map(issue => ({
      field: issue.instancePath.substring(1),
      message: issue.message,
    }))
    return reply.status(400).send({
      message: "Validation error",
      issues,
    })
  }
  console.error(error)
  return reply.status(500).send({ message: "Internal server error." })
})

server.register(fastifyCors, { origin: "*" })
server.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Brev.ly Server",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
})

server.register(fastifySwaggerUi, {
  routePrefix: "/docs",
})

server.register(createLinkRoute)

server.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
  console.log(`🔥 HTTP Server running on port ${env.PORT}`)
})
