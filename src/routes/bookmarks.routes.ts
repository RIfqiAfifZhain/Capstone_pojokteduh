import { Router } from "express";
import { addBookmark, removeBookmark, getUserBookmarks } from "../controllers/bookmarks.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// 1. Tambah Bookmark
router.post("/", authenticate, addBookmark);

// 2. Ambil Daftar Bookmark User
router.get("/", authenticate, getUserBookmarks);

// 3. Hapus Bookmark berdasarkan ID
router.delete("/:id", authenticate, removeBookmark);

export default router;