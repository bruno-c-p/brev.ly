import { db } from "@/infra/db"
import type { schema } from "@/infra/db/schemas"
import { type Either, makeLeft, makeRight } from "@/shared/either"
import type { InferSelectModel } from "drizzle-orm"
import { z } from "zod"

type GetAllLinksOutput = Array<InferSelectModel<typeof schema.link>>

export async function getAllLinks(): Promise<
  Either<never, { links: GetAllLinksOutput }>
> {
  const links = await db.query.link.findMany()
  return makeRight({ links: links ?? [] })
}
