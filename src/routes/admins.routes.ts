import { Router } from "express";
import { 
  getAdminProfile,
  getDashboardSummary,
  createSpot,
  getAdminSpots,
  updateSpot,
  deleteSpot
} from "../controllers/admins.controller.js";
import { authenticate, isAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

// 🛡️ PERLINDUNGAN GANDA: 
// Semua rute di bawah baris ini WAJIB Login & WAJIB ber-role ADMIN
router.use(authenticate, isAdmin);

// --- 1. PROFIL ADMIN (Bawaan aslimu) ---
router.get("/profile", getAdminProfile);

// --- 2. DASHBOARD SUMMARY (Tugas 3 PRD) ---
router.get("/dashboard", getDashboardSummary);

// --- 3. MANAJEMEN SPOT / CRUD (Tugas 4 PRD) ---
router.post("/spots", upload.single("photoUrl"), createSpot);      // Tambah Spot
router.get("/spots", getAdminSpots);     // Lihat Semua Spot (Versi Admin)
router.put("/spots/:id", upload.single("photoUrl"), updateSpot);    // Edit Spot
router.delete("/spots/:id", deleteSpot); // Hapus Spot

export default router;