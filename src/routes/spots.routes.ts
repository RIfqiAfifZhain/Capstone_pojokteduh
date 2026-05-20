import { Router } from "express";
import { searchSpots, getSpotBySlug } from "../controllers/spots.controller.js"; // 🌟 1. Import getSpotBySlug dari controller spot
import { getSpotReviews } from "../controllers/reviews.controller.js";
import { validateQuery } from "../middlewares/validate.middleware.js";
import { searchSpotsQuerySchema } from "../schemas/spots.schema.js";

const router = Router();

// 2. Rute Pencarian & Ambil Semua Data (Menggunakan path statis /search)
router.get("/search", validateQuery(searchSpotsQuerySchema), searchSpots);

// 3. Rute Mengambil Ulasan Berdasarkan ID Spot
router.get("/:id/reviews", getSpotReviews);

// 4. 🌟 RUTE DETAIL SPOT: Menangkap parameter :slug dinamis dari frontend
// ⚠️ CRITICAL: Harus diletakkan di PALING BAWAH setelah /search agar Express tidak bingung
router.get("/:slug", getSpotBySlug);

export default router;