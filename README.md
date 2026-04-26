1. Prerequisites (Wajib Terinstal)

    Node.js (v18+)

    PostgreSQL (v15+)

    Git


2. Database Setup (PostgreSQL)

    Sebelum menjalankan server, harus menyiapkan database terlebih dahulu:

    Buka pgAdmin 4 atau terminal PostgreSQL.

    Buat database baru dengan nama: pojok_teduh_db.

    Pastikan ingat password user postgres.


3. Backend Setup (The API)

    Buka terminal di folder backend:


A. Install & Sync
    
    Bash
    git pull origin main
    npm install
    npx drizzle-kit push

B. Environment Variables
    Buat file .env di root folder backend:

    Code snippet
    DATABASE_URL=postgres://postgres:PASSWORD_POSTGRES_KAMU@localhost:5432/pojok_teduh_db
    PORT=8080
    JWT_SECRET=pojok_teduh_secret_key_2026

C. Run Server

    Bash
    npm run dev
 Status Berhasil: 🚀 Server BERHASIL JALAN di http://localhost:8080


4. Frontend Setup (The UI)
    Buka terminal baru di folder frontend:

A. Environment Variables
    Buat file .env.local di root folder frontend:

    Code snippet
    NEXT_PUBLIC_API_URL=http://localhost:8080

B. Install & Run
    
    Bash
    npm install
    npm run dev
Status Berhasil: Buka http://localhost:3000


5. Technical Rules
### Aturan Import (Backend)
Karena menggunakan Node.js ESM, setiap import file lokal WAJIB menyertakan ekstensi .js, walaupun filenya .ts.
Salah: import { db } from "./db/index"
Benar: import { db } from "./db/index.js"

### Auth Flow
Register: Data dikirim ke /auth/user/register.
Login: Data dikirim ke /auth/user/login.
Token: Setelah login, token akan dikirim oleh backend. Simpan di localStorage untuk akses halaman privat.
