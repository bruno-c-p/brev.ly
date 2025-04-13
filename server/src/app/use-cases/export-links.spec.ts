import { isRight, unwrapEither } from "@/infra/shared/either"
import * as upload from "@/infra/storage/upload-file-to-storage"
import { makeLink } from "@/test/factories/make-link"
import { uuidv7 } from "uuidv7"
import { describe, expect, it, vi } from "vitest"
import { exportLinks } from "./export-links"

describe("export links", () => {
  it("should be able to export all links", async () => {
    const uploadStub = vi
      .spyOn(upload, "uploadFileToStorage")
      .mockImplementationOnce(async () => ({
        key: `${uuidv7()}.csv`,
        url: "https://www.localhost.com/test.csv",
      }))

    const originalUrlPattern = `https://www.localhost.com/${uuidv7()}`

    const link1 = await makeLink({ originalUrl: originalUrlPattern })
    const link2 = await makeLink({ originalUrl: originalUrlPattern })
    const link3 = await makeLink({ originalUrl: originalUrlPattern })
    const link4 = await makeLink({ originalUrl: originalUrlPattern })
    const link5 = await makeLink({ originalUrl: originalUrlPattern })

    const sut = await exportLinks(originalUrlPattern)

    const generatedCSVStream = uploadStub.mock.calls[0][0].contentStream

    const csvAsString = await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = []
      generatedCSVStream.on("data", (chunk: Buffer) => {
        chunks.push(chunk)
      })
      generatedCSVStream.on("end", () => {
        resolve(Buffer.concat(chunks).toString("utf-8"))
      })
      generatedCSVStream.on("error", (error: Error) => {
        reject(error)
      })
    })

    const csvAsArray = csvAsString
      .trim()
      .split("\n")
      .map(row => row.split(","))

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({
      reportUrl: "https://www.localhost.com/test.csv",
    })
    expect(csvAsArray).toEqual([
      ["ID", "Original URL", "Slug", "Visits", "Created at"],
      [
        link1.id,
        link1.originalUrl,
        link1.slug,
        link1.visits.toString(),
        expect.any(String),
      ],
      [
        link2.id,
        link2.originalUrl,
        link2.slug,
        link2.visits.toString(),
        expect.any(String),
      ],
      [
        link3.id,
        link3.originalUrl,
        link3.slug,
        link3.visits.toString(),
        expect.any(String),
      ],
      [
        link4.id,
        link4.originalUrl,
        link4.slug,
        link4.visits.toString(),
        expect.any(String),
      ],
      [
        link5.id,
        link5.originalUrl,
        link5.slug,
        link5.visits.toString(),
        expect.any(String),
      ],
    ])
  })
})
