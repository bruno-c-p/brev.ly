// src/infra/db/schemas/link.ts
import { bigint, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
var link = pgTable("link", {
  id: text("id").primaryKey().$defaultFn(() => uuidv7()),
  originalUrl: text("original_url").notNull(),
  slug: text("slug").notNull().unique(),
  visits: bigint({ mode: "number" }).notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export {
  link
};
