import { db } from "@/infra/db"
import { schema } from "@/infra/db/schemas"
import { type Either, makeLeft, makeRight } from "@/shared/either"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { ResourceNotFoundError } from "./errors/resource-not-found.error"

const redirectLinkInput = z.object({
  slug: z.string(),
})

type RedirectLinkInput = z.input<typeof redirectLinkInput>

export async function redirectLink(
  input: RedirectLinkInput
): Promise<Either<ResourceNotFoundError, { originalUrl: string }>> {
  const { slug } = redirectLinkInput.parse(input)
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
