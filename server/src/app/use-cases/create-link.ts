import { db } from "@/infra/db"
import { schema } from "@/infra/db/schemas"
import { type Either, makeLeft, makeRight } from "@/shared/either"
import type { InferSelectModel } from "drizzle-orm"
import { z } from "zod"
import { ResourceAlreadyExistsError } from "./errors/resource-already-exists.error"

const createLinkInput = z.object({
  originalUrl: z.string().url(),
  slug: z.string().min(3),
})

type CreateLinkInput = z.input<typeof createLinkInput>

type Link = InferSelectModel<typeof schema.link>

export async function createLink(
  input: CreateLinkInput
): Promise<Either<ResourceAlreadyExistsError, { link: Link }>> {
  const { originalUrl, slug } = createLinkInput.parse(input)

  const existingLink = await db.query.link.findFirst({
    where(fields, { eq }) {
      return eq(fields.slug, slug)
    },
  })

  if (existingLink) {
    return makeLeft(
      new ResourceAlreadyExistsError("Essa url encurtada já existe.")
    )
  }

  const [link] = await db
    .insert(schema.link)
    .values({
      originalUrl,
      slug,
    })
    .returning()

  return makeRight({ link })
}
