import type { FastifyDynamicSwaggerOptions } from "@fastify/swagger"
import { jsonSchemaTransform } from "fastify-type-provider-zod"

export const swaggerConfig: FastifyDynamicSwaggerOptions = {
  openapi: {
    info: {
      version: "1.0.0",
      title: "Brev.ly Server",
      summary: "Brev.ly Server API",
      description: "API documentation for the Brev.ly server",
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
      contact: {
        name: "Bruno Cardozo",
        url: "https://brunocardozo.com.br",
        email: "dev@brunocardozo.com.br",
      },
    },
    servers: [
      {
        url: "http://localhost:3333",
        description: "Local server",
      },
    ],
  },
  transform: jsonSchemaTransform,
}
