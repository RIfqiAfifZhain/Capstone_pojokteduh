import express from "express";
import cors from "cors"; 
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import adminsRoutes from "./routes/admins.routes.js";
import spotsRoutes from "./routes/spots.routes.js";
import reviewsRoutes from "./routes/reviews.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import bookmarksRoutes from "./routes/bookmarks.routes.js";
import "dotenv/config"; 
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./utils/swagger.js";

const app = express();
const PORT = process.env.PORT || 8080; 

// ==========================================
// KONFIGURASI SWAGGER VERCEL-PROOF
// ==========================================
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

// 1. Rute Dokumentasi Interaktif (Swagger UI)
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCssUrl: CSS_URL,
    customJs: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-bundle.js",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-standalone-preset.js",
    ],
  })
);

// 2. Rute Ekspor JSON (Fallback untuk Postman Tim Frontend)
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// 3. Rute Beranda (Agar halaman depan Vercel tidak "Cannot GET /")
app.get("/", (req, res) => {
  res.send("✅ API Pojok Teduh Berjalan! Silakan akses /api-docs untuk dokumentasi.");
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