import express from "express";
import cors from "cors"; // Wajib agar Frontend bisa akses
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import adminsRoutes from "./routes/admins.routes.js";
import spotsRoutes from "./routes/spots.routes.js";
import reviewsRoutes from "./routes/reviews.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import bookmarksRoutes from "./routes/bookmarks.routes.js";
import "dotenv/config"; // Pastikan env terbaca

const app = express();
const PORT = process.env.PORT || 8080; // Pakai 8080 sesuai tes Postman kita tadi

// 1. Middlewares
app.use(cors()); // Izinkan semua koneksi dari Frontend
app.use(express.json()); // Supaya bisa baca Body JSON

// 2. Routes
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/admins", adminsRoutes);
app.use("/spots", spotsRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/bookmarks", bookmarksRoutes);

// 3. Error Handler (Harus di bawah routes)
app.use(errorHandler);

// 4. Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server BERHASIL JALAN di http://localhost:${PORT}`);
});