import {
  createLinkRoute
} from "../../chunk-WTYJMJQ7.mjs";
import "../../chunk-UM33MBPT.mjs";
import "../../chunk-AQJIEIN2.mjs";
import "../../chunk-62KKQ274.mjs";
import {
  env
} from "../../chunk-BJACZAQF.mjs";
import "../../chunk-7HFJ4A6Z.mjs";
import "../../chunk-XKAJ3OQ2.mjs";
import "../../chunk-EOMN7M5I.mjs";

// src/infra/http/server.ts
import { fastifyCors } from "@fastify/cors";
import { fastifyMultipart } from "@fastify/multipart";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { fastify } from "fastify";
import {
  hasZodFastifySchemaValidationErrors,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler
} from "fastify-type-provider-zod";
var server = fastify();
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);
server.setErrorHandler((error, _request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    const issues = error.validation.map((issue) => ({
      field: issue.instancePath.substring(1),
      message: issue.message
    }));
    return reply.status(400).send({
      message: "Validation error",
      issues
    });
  }
  console.error(error);
  return reply.status(500).send({ message: "Internal server error." });
});
server.register(fastifyCors, { origin: "*" });
server.register(fastifyMultipart);
server.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Brev.ly Server",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});
server.register(fastifySwaggerUi, {
  routePrefix: "/docs"
});
server.register(createLinkRoute);
server.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
  console.log("HTTP Server running!");
});
