import { env } from "@/data/env/server"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from 'pg';

import * as schema from "./schema"

import { PostgresJsDatabase } from "drizzle-orm/postgres-js"

let db: PostgresJsDatabase<typeof schema>

if (!env.LOCALDEV) {
  console.log("Using neon database", process.env.VERCEL)
  const pool = new Pool({
    connectionString: env.DATABASE_URL,
  });
  db = drizzle(pool, { schema })

} else {
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
}

export { db }
