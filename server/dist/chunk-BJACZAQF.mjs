// src/env.ts
import { z } from "zod";
var envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  DATABASE_URL: z.string().url().startsWith("postgresql://")
});
var env = envSchema.parse(process.env);

export {
  env
};
