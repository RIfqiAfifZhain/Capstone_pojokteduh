import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Dokumentasi API Pojok Teduh",
      version: "1.0.0",
      description: "API untuk aplikasi Pojok Teduh",
    },
    servers: [
      {
        // Ganti dengan URL Vercel kamu!
        url: "https://capstone-pojokteduh.vercel.app",
        description: "Production Server (Vercel)",
      },
      {
        url: "http://localhost:8080",
        description: "Development Server (Local)",
      },
    ],
  },
  // GPS khusus untuk Vercel agar bisa menemukan file rute
  apis: [path.join(process.cwd(), "src/routes/*.ts")], 
};

export const swaggerSpec = swaggerJsdoc(options);