import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Dokumentasi API Pojok Teduh",
      version: "1.0.0",
      description: "Dokumentasi lengkap untuk endpoint aplikasi Pojok Teduh",
    },
    servers: [
      {
        url: "https://capstone-pojokteduh.vercel.app",
        description: "Production Server (Vercel)",
      },
      {
        url: "http://localhost:8080",
        description: "Development Server (Local)",
      },
    ],
    // TULIS DOKUMENTASI DI SINI AGAR TIDAK DIHAPUS VERCEL
    paths: {
      "/": {
        get: {
          summary: "Cek Status Server",
          description: "Endpoint untuk memastikan API Pojok Teduh berjalan dengan baik.",
          responses: {
            "200": { 
              description: "Server berjalan normal",
              content: {
                "text/plain": {
                  schema: { type: "string", example: "✅ API Pojok Teduh Berjalan! Silakan akses /api-docs untuk dokumentasi." }
                }
              }
            },
          },
        },
      },
      "/spots/search": {
        get: {
          summary: "Pencarian Tempat (Spots)",
          description: "Mencari tempat berdasarkan keyword (nama/deskripsi) dan berbagai filter.",
          parameters: [
            { name: "keyword", in: "query", description: "Kata kunci pencarian", schema: { type: "string" } },
            { name: "spot_type", in: "query", description: "Tipe (indoor/outdoor)", schema: { type: "string" } },
            { name: "atmosphere", in: "query", description: "Suasana (busy/quiet)", schema: { type: "string" } }
          ],
          responses: {
            "200": { description: "Berhasil mendapatkan data tempat" },
          },
        },
      }
      // Nanti kamu bisa melanjutkan menambahkan route /auth, /users, /reviews, dll di bawah sini
    },
  },
  // Kosongkan bagian apis agar Swagger tidak nge-crash saat memindai folder di Vercel
  apis: [], 
};

export const swaggerSpec = swaggerJsdoc(options);