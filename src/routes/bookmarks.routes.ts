import { Router } from "express";
import { addBookmark, removeBookmark, getUserBookmarks } from "../controllers/bookmarks.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authenticate, addBookmark);

router.get("/", authenticate, getUserBookmarks);

router.delete("/:id", authenticate, removeBookmark);

export default router;