import { db } from "@/infra/db"
import { schema } from "@/infra/db/schemas"
import { type Either, makeLeft, makeRight } from "@/infra/shared/either"
import { type InferSelectModel, desc, ilike } from "drizzle-orm"
import { z } from "zod"

type GetAllLinksOutput = Array<InferSelectModel<typeof schema.link>>

export async function getAllLinks(
  searchQuery?: string
): Promise<Either<never, { links: GetAllLinksOutput }>> {
  const links = await db
    .select()
    .from(schema.link)
    .where(
      searchQuery
        ? ilike(schema.link.originalUrl, `%${searchQuery}%`)
        : undefined
    )
    .orderBy(desc(schema.link.createdAt))
  return makeRight({ links: links ?? [] })
}
