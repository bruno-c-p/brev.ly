import { db } from "@/infra/db"
import { schema } from "@/infra/db/schemas"
import { type Either, makeLeft, makeRight } from "@/infra/shared/either"
import { redirectLinkSchema } from "@/infra/shared/schemas"
import { eq } from "drizzle-orm"
import type { z } from "zod"
import { ResourceNotFoundError } from "./errors/resource-not-found.error"

type RedirectLinkInput = z.infer<typeof redirectLinkSchema>

export async function redirectLink(
  input: RedirectLinkInput
): Promise<Either<ResourceNotFoundError, { originalUrl: string }>> {
  const { slug } = redirectLinkSchema.parse(input)

  const [link] = await db
    .select()
    .from(schema.link)
    .where(eq(schema.link.slug, slug))

  if (!link) {
    return makeLeft(new ResourceNotFoundError("Essa url encurtada não existe."))
  }

  await db
    .update(schema.link)
    .set({ visits: link.visits + 1 })
    .where(eq(schema.link.slug, slug))

  return makeRight({ originalUrl: link.originalUrl })
}
