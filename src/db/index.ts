import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
// Ambil data dari file sebelah (users.schema.ts)
import * as schema from "./schemas/users.schema.js"; 

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });