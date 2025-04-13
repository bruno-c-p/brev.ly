import { db } from "@/infra/db"
import { schema } from "@/infra/db/schemas"
import { type Either, makeLeft, makeRight } from "@/shared/either"
import { type InferSelectModel, desc, ilike } from "drizzle-orm"
import { z } from "zod"

type GetAllLinksOutput = Array<InferSelectModel<typeof schema.link>>

export async function getAllLinks(
  searchUrl?: string
): Promise<Either<never, { links: GetAllLinksOutput }>> {
  const links = await db
    .select()
    .from(schema.link)
    .where(
      searchUrl ? ilike(schema.link.originalUrl, `%${searchUrl}%`) : undefined
    )
    .orderBy(desc(schema.link.createdAt))
  return makeRight({ links: links ?? [] })
}
