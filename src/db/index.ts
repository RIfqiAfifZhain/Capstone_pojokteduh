import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

// 1. UBAH BAGIAN INI: Import seluruh skema dari file index.js agar semua tabel (spots, reviews, dll) terbaca, bukan hanya users.
import * as schema from "./schemas/index.js"; 

// 2. UBAH BAGIAN INI: Tambahkan izin SSL agar Supabase tidak memblokir koneksi dari komputer lokalmu.
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { 
    rejectUnauthorized: false 
  }
});

export const db = drizzle(pool, { schema });