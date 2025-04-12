import {
  ResourceAlreadyExistsError
} from "./chunk-AQJIEIN2.mjs";
import {
  db
} from "./chunk-62KKQ274.mjs";
import {
  makeLeft,
  makeRight
} from "./chunk-7HFJ4A6Z.mjs";
import {
  schema
} from "./chunk-XKAJ3OQ2.mjs";

// src/app/use-cases/create-link.ts
import { z } from "zod";
var createLinkInput = z.object({
  originalUrl: z.string().url(),
  slug: z.string().min(3)
});
async function createLink(input) {
  const { originalUrl, slug } = createLinkInput.parse(input);
  const existingLink = await db.query.link.findFirst({
    where(fields, { eq }) {
      return eq(fields.slug, slug);
    }
  });
  if (existingLink) {
    return makeLeft(
      new ResourceAlreadyExistsError("Essa url encurtada j\xE1 existe.")
    );
  }
  const [link] = await db.insert(schema.link).values({
    originalUrl,
    slug
  }).returning();
  return makeRight({ link });
}

export {
  createLink
};
