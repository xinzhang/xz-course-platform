import { env } from "@/data/env/server"
import { drizzle } from "drizzle-orm/node-postgres"
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "./schema"

import { PostgresJsDatabase } from "drizzle-orm/postgres-js"

let db: PostgresJsDatabase<typeof schema>

if (!env.VERCEL) {  
  console.log("Using local database")

  db = drizzle({
  schema,
  connection: {
    password: env.DB_PASSWORD,
    user: env.DB_USER,
    database: env.DB_NAME,
    host: env.DB_HOST,
  },
})
} else {
  console.log("Using neon database")
  db = drizzleNeon(neon(env.DATABASE_URL), { schema })
}

export { db }
