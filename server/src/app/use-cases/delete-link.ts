import { db } from "@/infra/db"
import { schema } from "@/infra/db/schemas"
import { type Either, makeLeft, makeRight } from "@/shared/either"
import { type InferSelectModel, eq } from "drizzle-orm"
import { z } from "zod"
import { ResourceNotFoundError } from "./errors/resource-not-found.error"

const deleteLinkInput = z.object({
  slug: z.string(),
})

type DeleteLinkInput = z.input<typeof deleteLinkInput>

export async function deleteLink(
  input: DeleteLinkInput
): Promise<Either<ResourceNotFoundError, { slug: string }>> {
  const { slug } = deleteLinkInput.parse(input)

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
