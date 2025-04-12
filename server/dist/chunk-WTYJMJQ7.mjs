import {
  createLink
} from "./chunk-UM33MBPT.mjs";
import {
  ResourceAlreadyExistsError
} from "./chunk-AQJIEIN2.mjs";
import {
  isRight,
  unwrapEither
} from "./chunk-7HFJ4A6Z.mjs";

// src/infra/http/routes/create-link.ts
import { z } from "zod";
var createLinkRoute = async (server) => {
  server.post(
    "/links",
    {
      schema: {
        summary: "Create a new link",
        body: z.object({
          originalUrl: z.string().url("URL inv\xE1lida"),
          slug: z.string().regex(
            /^[a-zA-Z0-9-]+$/,
            "A URL encurtada deve conter apenas letras, n\xFAmeros e h\xEDfen"
          ).min(3, "A URL encurtada deve ter pelo menos 3 caracteres")
        }),
        response: {
          201: z.object({
            originalUrl: z.string(),
            slug: z.string(),
            visits: z.number()
          }),
          400: z.object({
            message: z.string(),
            issues: z.array(
              z.object({
                field: z.string(),
                message: z.string()
              })
            )
          }).describe("Invalid request body"),
          409: z.object({ message: z.string() }).describe("Shortened URL already exists"),
          500: z.object({ message: z.string() }).describe("Internal server error")
        }
      }
    },
    async (request, reply) => {
      const { originalUrl, slug } = request.body;
      const result = await createLink({ originalUrl, slug });
      if (isRight(result)) {
        const { link } = unwrapEither(result);
        return reply.status(201).send(link);
      }
      const error = unwrapEither(result);
      switch (error.name) {
        case ResourceAlreadyExistsError.name:
          return reply.status(409).send({ message: error.message });
        default:
          return reply.status(500).send({ message: "Internal server error" });
      }
    }
  );
};

export {
  createLinkRoute
};
