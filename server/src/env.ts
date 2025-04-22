import { z } from "zod"

const envSchema = z.object({
  // Server
  PORT: z.coerce.number().default(3333),
  // Environment
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  // Database
  DATABASE_URL: z.string().url(),
  // Cloudflare
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  CLOUDFLARE_ACCESS_KEY_ID: z.string(),
  CLOUDFLARE_SECRET_ACCESS_KEY: z.string(),
  CLOUDFLARE_BUCKET_NAME: z.string(),
  CLOUDFLARE_BUCKET_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
