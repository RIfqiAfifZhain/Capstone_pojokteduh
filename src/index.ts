import express from "express";
import cors from "cors"; 
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import adminsRoutes from "./routes/admins.routes.js";
import spotsRoutes from "./routes/spots.routes.js";
import reviewsRoutes from "./routes/reviews.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import bookmarksRoutes from "./routes/bookmarks.routes.js";
import { swaggerSpec } from "./utils/swagger.js";

const app = express();
const PORT = process.env.PORT || 8080; 

// ==========================================
// KONFIGURASI SWAGGER (VERSI AMAN VERCEL)
// ==========================================

// 1. Rute Ekspor JSON (Ini yang dicari oleh Petstore & Postman)
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// 2. Rute UI Manual (Tampilan langsung di web kamu)
app.get("/api-docs", (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>API Pojok Teduh</title>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js" crossorigin></script>
      <script>
        window.onload = () => {
          window.ui = SwaggerUIBundle({
            url: '/api-docs.json',
            dom_id: '#swagger-ui',
          });
        };
      </script>
    </body>
    </html>
  `;
  res.send(html);
});

// 3. Rute Beranda
app.get("/", (req, res) => {
  res.send("✅ API Pojok Teduh Berjalan! Silakan akses /api-docs untuk melihat dokumentasi.");
});

// ==========================================
// MIDDLEWARES & ROUTES APLIKASI
// ==========================================
app.use(cors()); 
app.use(express.json()); 

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/admins", adminsRoutes);
app.use("/spots", spotsRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/bookmarks", bookmarksRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server BERHASIL JALAN di http://localhost:${PORT}`);
});

export default app;