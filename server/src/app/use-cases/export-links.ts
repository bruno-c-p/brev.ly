import { PassThrough, Transform } from "node:stream"
import { pipeline } from "node:stream/promises"
import { db, pg } from "@/infra/db"
import { schema } from "@/infra/db/schemas"
import { type Either, makeRight } from "@/infra/shared/either"
import { uploadFileToStorage } from "@/infra/storage/upload-file-to-storage"
import { stringify } from "csv-stringify"
import { ilike } from "drizzle-orm"

type ExportLinksOutput = {
  reportUrl: string
}

export async function exportLinks(
  searchQuery?: string
): Promise<Either<never, ExportLinksOutput>> {
  const { sql, params } = db
    .select({
      id: schema.link.id,
      originalUrl: schema.link.originalUrl,
      slug: schema.link.slug,
      visits: schema.link.visits,
      createdAt: schema.link.createdAt,
    })
    .from(schema.link)
    .where(
      searchQuery
        ? ilike(schema.link.originalUrl, `%${searchQuery}%`)
        : undefined
    )
    .toSQL()

  const cursor = pg.unsafe(sql, params as string[]).cursor(2)

  const csv = stringify({
    delimiter: ",",
    header: true,
    columns: [
      { key: "id", header: "ID" },
      { key: "original_url", header: "Original URL" },
      { key: "slug", header: "Slug" },
      { key: "visits", header: "Visits" },
      { key: "created_at", header: "Created at" },
    ],
  })

  const uploadToStorageStream = new PassThrough()

  const convertToCSVPipeline = pipeline(
    cursor,
    new Transform({
      objectMode: true,
      transform(chunks: unknown[], _encoding, callback) {
        for (const chunk of chunks) {
          this.push(chunk)
        }
        callback()
      },
    }),
    csv,
    uploadToStorageStream
  )

  const uploadToStorage = uploadFileToStorage({
    contentType: "text/csv",
    folder: "downloads",
    fileName: `${new Date().toISOString()}-link.csv`,
    contentStream: uploadToStorageStream,
  })

  const [{ url }] = await Promise.all([uploadToStorage, convertToCSVPipeline])

  return makeRight({ reportUrl: url })
}
