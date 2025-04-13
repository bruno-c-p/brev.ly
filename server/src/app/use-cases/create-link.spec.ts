import { db } from "@/infra/db"
import { schema } from "@/infra/db/schemas"
import { isRight, unwrapEither } from "@/infra/shared/either"
import { eq } from "drizzle-orm"
import { uuidv7 } from "uuidv7"
import { describe, expect, it } from "vitest"
import { ZodError } from "zod"
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

  it("should not be able to create a link with an existing slug", async () => {
    const customSlug = uuidv7()
    await createLink({
      originalUrl: `https://www.localhost.com/${customSlug}`,
      slug: customSlug,
    })

    const sut = await createLink({
      originalUrl: `https://www.localhost.com/${customSlug}`,
      slug: customSlug,
    })

    expect(isRight(sut)).toBe(false)
    expect(sut.left?.message).toEqual("Essa url encurtada já existe.")
  })

  it.each([
    {
      scenario: "invalid url",
      input: {
        originalUrl: "invalid-url",
        slug: uuidv7(),
      },
    },
    {
      scenario: "invalid slug format",
      input: {
        originalUrl: "https://example.com",
        slug: "invalid-slug!@:L@:L:!}{}{",
      },
    },
    {
      scenario: "slug too short",
      input: {
        originalUrl: "https://example.com",
        slug: "in",
      },
    },
  ])(
    "should not be able to create a link with $scenario",
    async ({ input }) => {
      await expect(() => createLink(input)).rejects.toThrow(ZodError)
    }
  )
})
