import { db } from "@/infra/db"
import { schema } from "@/infra/db/schemas"
import { isRight, unwrapEither } from "@/shared/either"
import { makeLink } from "@/test/factories/make-link"
import { eq } from "drizzle-orm"
import { uuidv7 } from "uuidv7"
import { describe, expect, it } from "vitest"
import { deleteLink } from "./delete-link"

describe("delete link", () => {
  it("should be able to delete a link", async () => {
    const createdLink = await makeLink()

    const sut = await deleteLink({
      slug: createdLink.slug,
    })

    expect(isRight(sut)).toBe(true)

    const result = await db
      .select()
      .from(schema.link)
      .where(eq(schema.link.slug, createdLink.slug))

    expect(result).toHaveLength(0)
  })
})
