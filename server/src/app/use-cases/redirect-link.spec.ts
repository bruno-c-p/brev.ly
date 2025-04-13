import { db } from "@/infra/db"
import { schema } from "@/infra/db/schemas"
import { isRight, unwrapEither } from "@/shared/either"
import { makeLink } from "@/test/factories/make-link"
import { eq } from "drizzle-orm"
import { describe, expect, it } from "vitest"
import { ZodError } from "zod"
import { redirectLink } from "./redirect-link"

describe("redirect link", () => {
  it("should be able to redirect a link", async () => {
    const createdLink = await makeLink()

    const sut = await redirectLink({
      slug: createdLink.slug,
    })

    expect(isRight(sut)).toBe(true)
    expect(sut.right?.originalUrl).toEqual(createdLink.originalUrl)

    const result = await db
      .select()
      .from(schema.link)
      .where(eq(schema.link.slug, createdLink.slug))

    expect(result[0].visits).toEqual(createdLink.visits + 1)
  })

  it("should not be able to redirect a link that does not exist", async () => {
    const sut = await redirectLink({
      slug: "invalid-slug",
    })

    expect(isRight(sut)).toBe(false)
    expect(sut.left?.message).toEqual("Essa url encurtada não existe.")
  })

  it("should not be able to redirect a link with an invalid slug", async () => {
    await expect(() =>
      redirectLink({ slug: "invalid!-@slug" })
    ).rejects.toThrow(ZodError)
  })
})
