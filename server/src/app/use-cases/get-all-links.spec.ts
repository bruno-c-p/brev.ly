import { isRight, unwrapEither } from "@/shared/either"
import { makeLink } from "@/test/factories/make-link"
import { uuidv7 } from "uuidv7"
import { describe, expect, it } from "vitest"
import { getAllLinks } from "./get-all-links"

describe("get all links", () => {
  it("should be able to get all links", async () => {
    const originalUrlPattern = `https://www.localhost.com/${uuidv7()}`

    const link1 = await makeLink({ originalUrl: originalUrlPattern })
    const link2 = await makeLink({ originalUrl: originalUrlPattern })
    const link3 = await makeLink({ originalUrl: originalUrlPattern })
    const link4 = await makeLink({ originalUrl: originalUrlPattern })
    const link5 = await makeLink({ originalUrl: originalUrlPattern })

    const sut = await getAllLinks(originalUrlPattern)

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).links.length).toEqual(5)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link5.id }),
      expect.objectContaining({ id: link4.id }),
      expect.objectContaining({ id: link3.id }),
      expect.objectContaining({ id: link2.id }),
      expect.objectContaining({ id: link1.id }),
    ])
  })
})
