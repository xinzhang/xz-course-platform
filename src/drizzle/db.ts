import { env } from "@/data/env/server"
import { drizzle } from "drizzle-orm/node-postgres"
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import { createClient, neonConfig } from "@neondatabase/serverless";
import ws from 'ws';

import * as schema from "./schema"

import { PostgresJsDatabase } from "drizzle-orm/postgres-js"

let db: PostgresJsDatabase<typeof schema>
if (!env.LOCALDEV) {

  console.log("Using neon database", process.env.VERCEL)
  global.WebSocket = ws as any;
  neonConfig.webSocketConstructor = ws;
  // const sql = neon(process.env.DATABASE_URL!);
  const client = createClient({ connectionString: env.DATABASE_URL })
  db = drizzleNeon(client, { schema });
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
