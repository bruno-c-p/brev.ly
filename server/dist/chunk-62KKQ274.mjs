import {
  env
} from "./chunk-BJACZAQF.mjs";
import {
  schema
} from "./chunk-XKAJ3OQ2.mjs";

// src/infra/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
var pg = postgres(env.DATABASE_URL);
var db = drizzle(pg, { schema });

export {
  pg,
  db
};
