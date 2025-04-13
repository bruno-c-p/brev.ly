import { db } from "@/infra/db"
import { schema } from "@/infra/db/schemas"
import { fakerPT_BR as faker } from "@faker-js/faker"
import type { InferInsertModel } from "drizzle-orm"

export async function makeLink(
  overrides?: Partial<InferInsertModel<typeof schema.link>>
) {
  const [result] = await db
    .insert(schema.link)
    .values({
      originalUrl: faker.internet.url(),
      slug: faker.lorem.slug(),
      ...overrides,
    })
    .returning()

  return result
}
