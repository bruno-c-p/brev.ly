import { env } from "@/env"
import { fastifyCors } from "@fastify/cors"
import { fastifySwagger } from "@fastify/swagger"
import { fastifySwaggerUi } from "@fastify/swagger-ui"
import { fastifyWebsocket } from "@fastify/websocket"
import { fastify } from "fastify"
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod"
import { globalErrorHandler } from "./global-error-handler"
import { createLinkRoute } from "./routes/create-link"
import { deleteLinkRoute } from "./routes/delete-link"
import { getAllLinksRoute } from "./routes/get-all-links"
import { swaggerConfig } from "./swagger.config"

const server = fastify()

server.setErrorHandler(globalErrorHandler)

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.register(fastifyCors, { origin: "*" })
server.register(fastifySwagger, swaggerConfig)
server.register(fastifySwaggerUi, { routePrefix: "/docs" })

server.register(createLinkRoute)
server.register(deleteLinkRoute)
server.register(getAllLinksRoute)

server.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
  console.log(`🔥 HTTP Server running on port ${env.PORT}`)
})
