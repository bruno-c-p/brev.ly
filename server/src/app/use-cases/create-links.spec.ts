import { db } from "@/infra/db"
import { schema } from "@/infra/db/schemas"
import { isRight, unwrapEither } from "@/shared/either"
import { eq } from "drizzle-orm"
import { uuidv7 } from "uuidv7"
import { describe, expect, it } from "vitest"
import { createLink } from "./create-link"

describe("create link", () => {
  it("should be able to create a link", async () => {
    const customSlug = uuidv7()
    const sut = await createLink({
      originalUrl: `https://www.localhost.com/${customSlug}`,
      slug: customSlug,
    })

    expect(isRight(sut)).toBe(true)

    const result = await db
      .select()
      .from(schema.link)
      .where(eq(schema.link.slug, customSlug))

    expect(result).toHaveLength(1)
    expect(sut.right?.link).toEqual(result[0])
  })
})
