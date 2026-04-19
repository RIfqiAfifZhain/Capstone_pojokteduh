import { Router } from "express";
import { getUserProfile } from "../controllers/users.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/profile", authenticate, getUserProfile);

export default router;
