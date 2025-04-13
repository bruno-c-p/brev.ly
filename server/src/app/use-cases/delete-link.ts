import { db } from "@/infra/db"
import { schema } from "@/infra/db/schemas"
import { type Either, makeLeft, makeRight } from "@/infra/shared/either"
import { deleteLinkSchema } from "@/infra/shared/schemas"
import { eq } from "drizzle-orm"
import type { z } from "zod"
import { ResourceNotFoundError } from "./errors/resource-not-found.error"

type DeleteLinkInput = z.infer<typeof deleteLinkSchema>

export async function deleteLink(
  input: DeleteLinkInput
): Promise<Either<ResourceNotFoundError, { slug: string }>> {
  const { slug } = deleteLinkSchema.parse(input)

  const existingLink = await db.query.link.findFirst({
    where(fields, { eq }) {
      return eq(fields.slug, slug)
    },
  })

  if (!existingLink) {
    return makeLeft(new ResourceNotFoundError("Essa url encurtada não existe."))
  }

  const [link] = await db
    .delete(schema.link)
    .where(eq(schema.link.slug, slug))
    .returning()

  return makeRight({ slug: link.slug })
}
